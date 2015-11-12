#!/bin/bash

aws s3 sync . s3://clintonfoundation/lightbox/ --acl public-read --delete --exclude "*/.DS_Store" --exclude ".DS_Store" --exclude ".git/*"
