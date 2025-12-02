#!/bin/sh

# Generate root CA
openssl genrsa -out root-ca-key.pem 2048
openssl req -new -x509 -days 3650 -key root-ca-key.pem -sha256 -out root-ca.pem -subj "/C=US/ST=CA/L=San Francisco/O=Wazuh/OU=Root CA/CN=Wazuh Root CA"

# Generate certificates for each component
for component in wazuh-indexer wazuh-manager wazuh-dashboard; do
    openssl genrsa -out $component-key.pem 2048
    openssl req -subj "/C=US/ST=CA/L=San Francisco/O=Wazuh/OU=$component/CN=$component" -new -key $component-key.pem -out $component.csr
    echo "subjectAltName = DNS:$component" > $component.ext
    openssl x509 -req -days 3650 -in $component.csr -CA root-ca.pem -CAkey root-ca-key.pem -CAcreateserial -out $component.pem -sha256 -extfile $component.ext
done
