all: build

build:
	dotnet build

deploy:
	dotnet publish -c Release -r linux-x64 --self-contained true /p:PublishSingleFile=true -o bin/publish
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "mkdir -p /home/azureuser/astra"
	scp bin/publish/* azureuser@datadecoders.ukwest.cloudapp.azure.com:/home/azureuser/astra/
	scp appsettings.json azureuser@datadecoders.ukwest.cloudapp.azure.com:/home/azureuser/astra/
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "chmod +x /home/azureuser/astra/sam-astra"

deploy-service:
	scp astra.service azureuser@datadecoders.ukwest.cloudapp.azure.com:/home/azureuser/astra/
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "sudo cp -r /home/azureuser/astra/astra.service /etc/systemd/system/ && sudo systemctl daemon-reload && sudo systemctl enable astra && sudo systemctl restart astra"
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "sudo systemctl status astra"

service-status:
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "sudo systemctl status astra"

service-logs:
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "sudo journalctl -u astra -f"

service-restart:
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "sudo systemctl restart astra"

service-stop:
	ssh azureuser@datadecoders.ukwest.cloudapp.azure.com "sudo systemctl stop astra"
