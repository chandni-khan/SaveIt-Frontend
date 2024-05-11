terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "eu-west-1"
  access_key = "access_key"
  secret_key = "secret_key"
}

resource "tls_private_key" "rsa_saveit" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

variable "key_name" {}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.rsa_saveit.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.rsa_saveit.private_key_pem
  filename = var.key_name
}

resource "aws_instance" "public_instance" {
  ami           = "ami-0dfdc165e7af15242"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.key_pair.key_name
  tags = {
    Name = "chandni_instance"
  }
}
