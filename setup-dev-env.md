## Install docker on ubunutu:
```
# https://docs.docker.com/engine/install/ubuntu/

# Set up the repository
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null


# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

## Verify and start docker:
```
systemctl start docker
systemctl status docker
systemctl enable docker
docker-compose --version
```


## Chuẩn bị môi trường nginx và deploy
- Copy thư mục deploy lên server, vào thư mục code
- Copy Dockerfile và docker-compose.yml lên server, vào thư mục code. 
- Chỉnh sửa Dockerfile nếu cần thiết (command build, thư mục dist)
- Run command để start:
```
docker-compose up -d
```

- Rebuild lại app:

```
- docker-compose build
- docker-compose up -d
```

