DOCKER_IMAGE_PATH="docker-image/"
DOCKER_IMAGE=$1
REMOTEHOST=$2
PORT=$3
VERSION=$4

# 清屏
echo -e "\033[2J"

echo "Uploading '$DOCKER_IMAGE' to $REMOTEHOST"
scp -P $PORT "$DOCKER_IMAGE_PATH$DOCKER_IMAGE" "$REMOTEHOST:~/" &&
echo "Loading docker image from $DOCKER_IMAGE..." &&
ssh -t $REMOTEHOST -p $PORT "
    docker image load < $DOCKER_IMAGE &&
    echo 'Try to remove running containner...' &&
    docker stop laputa-app && docker rm laputa-app
    docker run --name laputa-app -p 18080:80 -d laputa-app:$VERSION" && 
    echo "$(date) \033[32mDocker deploy success. \033[0m" || echo "$(date) \007 \033[31mDocker deploy failed! \033[0m" 

