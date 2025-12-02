FROM docker.elastic.co/beats/filebeat:8.12.0

USER root

# Copy the config into the image and set safe permissions
COPY filebeat.yml /usr/share/filebeat/filebeat.yml
RUN chown root:root /usr/share/filebeat/filebeat.yml && chmod 644 /usr/share/filebeat/filebeat.yml

# Revert to the original image user if necessary (filebeat expects to run as a non-root user inside image)
USER root

# Keep original image entrypoint/cmd
