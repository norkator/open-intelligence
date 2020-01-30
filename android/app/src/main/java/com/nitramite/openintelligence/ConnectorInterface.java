package com.nitramite.openintelligence;

public interface ConnectorInterface {

    void onMissingParameters(String reason);

    void onAskToTrustKey(final String hostName, final String hostFingerPrint, final String hostKey);

    void onTaskCompleted(Connection connection);

    void onConnectionError(String error);

} // End of interface()