provider "aws" {
  profile = "default"
  region = var.region
}

resource "aws_instance" "aajm" {
  ami = var.ami
  instance_type = "t2.micro"
  key_name = var.key_name
  vpc_security_group_ids = [aws_security_group.allow_ssh.id]
}

resource "aws_eip" "aajm_ip" {
  vpc = true
  instance = aws_instance.aajm.id
}

resource "aws_security_group" "allow_ssh" {
  name = "allow_ssh"
  description = "All SSH connections on port 22"

  ingress {
    from_port = 80
    protocol = "tcp"
    to_port = 80

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  ingress {
    from_port = 443
    protocol = "tcp"
    to_port = 443

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  ingress {
    from_port = 22
    protocol = "tcp"
    to_port = 22

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }

  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0

    cidr_blocks = [
      "0.0.0.0/0"
    ]
  }
}

output "ip" {
  value = aws_eip.aajm_ip.public_ip
}