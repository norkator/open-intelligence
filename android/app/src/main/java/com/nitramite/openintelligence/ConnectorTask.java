package com.nitramite.openintelligence;

import android.os.AsyncTask;
import android.util.Base64;
import com.jcraft.jsch.HostKey;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

public class ConnectorTask extends AsyncTask<String, String, String> {

    // Logging
    private final static String TAG = "ConnectorTask";

    // Variables
    private Connection connection = null;
    private Session session = null;
    private ConnectionState connectionState = ConnectionState.NONE;
    private ConnectorInterface connectorInterface;

    // Constructor
    ConnectorTask(ConnectorInterface connectorInterface, Connection connection) {
        this.connectorInterface = connectorInterface;
        this.connection = connection;
        this.execute();
    }

    // Current state of connection
    public ConnectionState getConnectionState() {
        return connectionState;
    }

    @Override
    protected String doInBackground(String... params) {
        startSSHTunnelConnection(this.connection);
        return null;
    }

    @Override
    protected void onPostExecute(String param) {
    }


    /**
     * Create ssh connection
     *
     * @param connection object
     */
    private void startSSHTunnelConnection(final Connection connection) {
        if (connection.validRequirements()) {
            this.connectionState = ConnectionState.CONNECTING;

            JSch sshClient = null;
            try {
                sshClient = new JSch();

                // Use private key
                sshClient.addIdentity(connection.getSshPrivateKeyLocation(), connection.getSshPrivateKeyPassphrase());
                session = sshClient.getSession(connection.getSshUserName(), connection.getSshAddress(), connection.getSshPort());

                session.setPortForwardingL(connection.getTunnelServerPort(),
                        connection.getTunnelServerAddress(), connection.getTunnelServerPort());

                if (!connection.getSshStrictHostKeyChecking()) {
                    session.setConfig("StrictHostKeyChecking", "no");
                    session.connect(5000);
                    session.openChannel("direct-tcpip");
                    this.connectionState = ConnectionState.CONNECTED;
                    this.connectorInterface.onTaskCompleted(connection);
                } else {
                    session.setConfig("StrictHostKeyChecking", "yes");
                    if (connection.getSshHostKey() != null) {
                        byte[] keyBytes = Base64.decode(connection.getSshHostKey(), Base64.DEFAULT);
                        sshClient.getHostKeyRepository().add(new HostKey(connection.getSshHostName(), keyBytes), null);
                    }
                    session.connect();
                    session.openChannel("direct-tcpip");
                    this.connectionState = ConnectionState.CONNECTED;
                    this.connectorInterface.onTaskCompleted(connection);
                }

            } catch (JSchException e) {
                if (e.toString().contains("reject HostKey")) {
                    this.connectorInterface.onAskToTrustKey(
                            session.getHostKey().getHost(),
                            session.getHostKey().getFingerPrint(sshClient),
                            session.getHostKey().getKey()
                    );
                } else {
                    this.connectorInterface.onConnectionError(e.toString());
                }
                this.connectionState = ConnectionState.NONE;
            } catch (NullPointerException e) {
                this.connectionState = ConnectionState.NONE;
                this.connectorInterface.onConnectionError(e.toString());
            }
        } else {
            this.connectionState = ConnectionState.NONE;
            this.connectorInterface.onMissingParameters("Connection and tunnel properties are not yet set at settings.");
        }
    }


}
