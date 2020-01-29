package com.nitramite.openintelligence;

public class Connection {

    private String sshAddress;
    private Integer sshPort;
    private String sshUserName;
    private String sshPrivateKeyLocation;
    private String sshPrivateKeyPassphrase;
    private Boolean sshStrictHostKeyChecking;

    private String sshHostName;
    private String sshHostKeyFingerPrint;
    private String sshHostKey;

    private String tunnelServerAddress;
    private Integer tunnelServerPort;


    // Constructor
    Connection(String sshAddress, Integer sshPort, String sshUserName, String sshPrivateKeyLocation,
               String sshPrivateKeyPassphrase, Boolean sshStrictHostKeyChecking,
               String tunnelServerAddress, Integer tunnelServerPort,
               String sshHostName, String sshHostKeyFingerPrint, String sshHostKey) {
        this.sshAddress = sshAddress;
        this.sshPort = sshPort;
        this.sshUserName = sshUserName;
        this.sshPrivateKeyLocation = sshPrivateKeyLocation;
        this.sshPrivateKeyPassphrase = sshPrivateKeyPassphrase;
        this.sshStrictHostKeyChecking = sshStrictHostKeyChecking;
        this.tunnelServerAddress = tunnelServerAddress;
        this.tunnelServerPort = tunnelServerPort;
        this.sshHostName = sshHostName;
        this.sshHostKeyFingerPrint = sshHostKeyFingerPrint;
        this.sshHostKey = sshHostKey;
    }

    // ---------------------------------------------------------------------------------------------

    Boolean validRequirements() {
        return this.sshAddress != null && this.sshPort != -1 && this.sshUserName != null &&
                this.sshPrivateKeyLocation != null && this.sshStrictHostKeyChecking != null &&
                this.tunnelServerAddress != null && this.tunnelServerPort != -1;
    }

    // ---------------------------------------------------------------------------------------------

    String getSshAddress() {
        return sshAddress;
    }

    Integer getSshPort() {
        return sshPort;
    }

    String getSshUserName() {
        return sshUserName;
    }

    String getSshPrivateKeyLocation() {
        return sshPrivateKeyLocation;
    }

    String getSshPrivateKeyPassphrase() {
        return sshPrivateKeyPassphrase;
    }

    Boolean getSshStrictHostKeyChecking() {
        return sshStrictHostKeyChecking;
    }

    String getSshHostName() {
        return sshHostName;
    }

    public String getSshHostKeyFingerPrint() {
        return sshHostKeyFingerPrint;
    }

    String getSshHostKey() {
        return sshHostKey;
    }


    Integer getTunnelServerPort() {
        return tunnelServerPort;
    }

    String getTunnelServerAddress() {
        return tunnelServerAddress;
    }


    // ---------------------------------------------------------------------------------------------

}
