resource "aws_s3_bucket" "this" {
  // Our bucket's name is going to be the same as our site's domain name.
  bucket = var.bucket
  // Because we want our site to be available on the internet, we set this so
  // anyone can read this bucket.
  # acl = var.acl
  // We also need to create a policy that allows anyone to view the content.
  // This is basically duplicating what we did in the ACL but it's required by
  // AWS. This post: http://amzn.to/2Fa04ul explains why.
  # policy = data.template_file.policy.rendered

  // S3 understands what it means to host a website.
  # website {
  #   // Here we tell S3 what to use when a request comes in to the root
  #   // ex. https://www.runatlantis.io
  #   index_document = var.website["index_document"]
  #   // The page to serve up if a request results in an error or a non-existing
  #   // page.
  #   error_document = var.website["error_document"]

  #   redirect_all_requests_to = var.website["redirect_all_requests_to"]
  # }
}

resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "this" {
  bucket = aws_s3_bucket.this.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "this" {
  depends_on = [
    aws_s3_bucket_public_access_block.this,
    aws_s3_bucket_ownership_controls.this,
  ]

  bucket = aws_s3_bucket.this.id
  acl    = var.acl
}

resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = data.template_file.policy.rendered

  depends_on = [
    aws_s3_bucket.this
  ]
}

// define s3 bucket policy
data "template_file" "policy" {
  template = file("${path.module}/policy.json")

  vars = {
    bucket_name = var.bucket
  }
}
