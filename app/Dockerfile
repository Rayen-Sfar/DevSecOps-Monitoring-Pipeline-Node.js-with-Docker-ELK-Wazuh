FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]

FROM node:18-alpine

# Installer Wazuh Agent
RUN apk add --no-cache curl && \
    curl -sO https://packages.wazuh.com/4.x/apt/pool/main/w/wazuh-agent/wazuh-agent_4.7.0-1_amd64.deb && \
    apk add --no-cache --allow-untrusted wazuh-agent_4.7.0-1_amd64.deb && \
    rm wazuh-agent_4.7.0-1_amd64.deb

# Copier les fichiers
COPY . /app
WORKDIR /app

# Copier la config de l’agent
COPY wazuh-agent.conf /var/ossec/etc/ossec.conf

# Installer les dépendances
RUN npm install

# Lancer l’application
CMD ["npm", "start"]