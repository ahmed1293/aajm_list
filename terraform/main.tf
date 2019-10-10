provider "aws" {
  profile = "default"
  region = var.region
}

resource "aws_instance" "aajm" {
  ami = var.ami
  instance_type = "t2.micro"
  key_name = var.key_name
}

resource "aws_eip" "aajm_ip" {
  vpc = true
  instance = aws_instance.aajm.id
}

output "ip" {
  value = aws_eip.aajm_ip.public_ip
}