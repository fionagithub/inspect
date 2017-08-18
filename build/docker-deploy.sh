DOCKER_IMAGE_PATH="docker-image/"
DOCKER_IMAGE=$1
REMOTEHOST=$2

# 清屏
echo -e "\033[2J"

echo "'$DOCKER_IMAGE' --> $REMOTEHOST"
scp "$DOCKER_IMAGE_PATH$DOCKER_IMAGE" "$REMOTEHOST:~/" &&
echo "Loading docker image..." &&
ssh -t $REMOTEHOST "
    docker image load < $DOCKER_IMAGE &&
    docker run --rm --name laputa-app -p 18080:80 -d laputa-app && 
    echo -e '\033[32m Docker deploy success. \033[0m' || echo '\007 \033[31m Docker deploy failed! \033[0m' 
" &&
echo "Deploy Complete!"
