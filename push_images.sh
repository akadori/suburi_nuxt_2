#/bin/bash
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 413815580661.dkr.ecr.ap-northeast-1.amazonaws.com
docker build -t tamari_node_get_header .
docker tag tamari_node_get_header:latest 413815580661.dkr.ecr.ap-northeast-1.amazonaws.com/tamari_node_get_header:latest
docker push 413815580661.dkr.ecr.ap-northeast-1.amazonaws.com/tamari_node_get_header:latest