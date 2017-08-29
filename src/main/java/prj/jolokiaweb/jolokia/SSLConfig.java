package prj.jolokiaweb.jolokia;

public class SSLConfig {
    private boolean useSSL = false;
    private String keystorePath;
    private String keystoreAlias;
    private String keystorePassword;
    private boolean allowSelfSignedCert = false;

    public String getKeystorePath() {
        return keystorePath;
    }

    public void setKeystorePath(String keystorePath) {
        this.keystorePath = keystorePath;
    }

    public String getKeystoreAlias() {
        return keystoreAlias;
    }

    public void setKeystoreAlias(String keystoreAlias) {
        this.keystoreAlias = keystoreAlias;
    }

    public String getKeystorePassword() {
        return keystorePassword;
    }

    public void setKeystorePassword(String keystorePassword) {
        this.keystorePassword = keystorePassword;
    }

    public boolean isSelfSignedCertAllowed() {
        return useSSL && (allowSelfSignedCert || !isCustomCert());
    }

    public void setAllowSelfSignedCert(boolean allowSelfSignedCert) {
        this.allowSelfSignedCert = allowSelfSignedCert;
    }

    public boolean isUseSSL() {
        return useSSL;
    }
    public boolean isCustomCert() {
        return keystorePath != null;
    }

    public void setUseSSL(boolean useSSL) {
        this.useSSL = useSSL;
    }

}
