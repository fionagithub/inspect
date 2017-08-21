DOCKER_IMAGE_PATH="docker-image/"
DOCKER_IMAGE=$1
REMOTEHOST=$2
VERSION=$3

# 清屏
echo -e "\033[2J"

echo "Copy '$DOCKER_IMAGE' to $REMOTEHOST"
scp "$DOCKER_IMAGE_PATH$DOCKER_IMAGE" "$REMOTEHOST:~/" &&
echo "Loading docker image..." &&
ssh -t $REMOTEHOST "
    docker image load < $DOCKER_IMAGE &&
    docker run --rm --name laputa-app -p 18080:80 -d laputa-app:$VERSION" && 
    echo "$(date) \033[32mDocker deploy success. \033[0m" || echo "$(date) \007 \033[31mDocker deploy failed! \033[0m" 

