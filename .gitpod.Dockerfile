# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-full/tags
FROM gitpod/workspace-full:2022-05-08-14-31-53

# Install custom tools, runtime, etc.
# install-packages is a wrapper for `apt` that helps skip a few commands in the docker env.
RUN sudo install-packages \
          binwalk \
          clang \
          tmux

# Install postgres
USER root
RUN apt-get update && apt-get install -y postgresql postgresql-contrib && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

# Setup postgres server for user gitpod
USER gitpod
ENV PATH="/usr/lib/postgresql/10/bin:$PATH"
RUN mkdir -p ~/pg/data; mkdir -p ~/pg/scripts; mkdir -p ~/pg/logs; mkdir -p ~/pg/sockets; initdb -D pg/data/
RUN echo '#!/bin/bash\npg_ctl -D ~/pg/data/ -l ~/pg/logs/log -o "-k ~/pg/sockets" start' > ~/pg/scripts/pg_start.sh
RUN echo '#!/bin/bash\npg_ctl -D ~/pg/data/ -l ~/pg/logs/log -o "-k ~/pg/sockets" stop' > ~/pg/scripts/pg_stop.sh
RUN chmod +x ~/pg/scripts/*
ENV PATH="$HOME/pg/scripts:$PATH"

# Set some environment variables
#postgres://user:pass@127.0.0.1/dbname
ENV DATABASE_URL=postgres://bfmnfopq:qp9CwVoyvXUNjquQCDXN5FYVWRcjE7iR@john.db.elephantsql.com/bfmnfopq
ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000

# Give back control
USER root
