---
tags:
  - rails
date: "2011-08-29T00:00:00Z"
description: Multiple Attachments with carrierwave and nested_form
keywords: rails, carrierwave, nested_form, attachments
title: Multiple files upload with carrierwave and nested_form
---

I wrote this post just to show how it's possible to get a perfectly working
form with multiple files upload within a few minutes. If you need to implement
multiple file attachments to a given object with only one form quickly, this
example could help you.

So let's create an example project (I used one of mine rails
[templates](https://github.com/lucapette/rails-templates)\_:

{{< highlight sh >}}
rails new carrierwave-nested_form -d mysql -m rails-templates/jquery.rb
{{< / highlight >}}

Then add the gems to Gemfile:

{{< highlight ruby >}}
gem 'carrierwave', '>= 0.5.3'

gem 'nested_form'
{{< / highlight >}}

The specified version for carrierwave is required because there is a small bug
in the previous versions of carrierwave that creates some problems with nested
forms.

In this example, I chose to use two simple models related with a polymorphic association. In order to do that, let's create the two model objects:

{{< highlight sh >}}
rails generate model article title:string description:text
rails generate model attachment description:text file:string attachable:references
{{< / highlight >}}

You have to add the polymorphic option to the migration for the attachments
before executing it.

Now that we have the two model objects, we install the nested_form gem files
in our project:

{{< highlight sh >}}
rails g nested_form:install
{{< / highlight >}}

This gem is very nice because it gives you the opportunity to create nested
forms with nice javascript add/remove links with a minimum effort. Before
proceeding with the nested form, please remember to add the javascript to your
layout:

{{< highlight ruby >}}
<%= javascript_include_tag :defaults,"nested_form" %>
{{< / highlight >}}

So we are ready to create a carrierwave uploader:

{{< highlight ruby >}}
rails generate uploader file
{{< / highlight >}}

and mount the uploader to the chosen field of the attachment model:

{{< highlight ruby >}}
class Attachment < ActiveRecord::Base
attr_accessible :description, :file

belongs_to :attachable, :polymorphic => true

mount_uploader :file, FileUploader
end
{{< / highlight >}}

Pratically, a carrierwave uploader is a class that handles a certain type of
uploading in your model. You just need to _mount_ the uploader of a string
field of your model. This is a very good design decision because it gives you
a lot of flexibility, for example, when you want to share the same uploading
features between two models.

Now, we are ready to add the nested feature to the article form. So let's
proceed in the following order:

{{< highlight ruby >}}
class Article < ActiveRecord::Base
attr_accessible :title, :description, :attachments_attributes

has_many :attachments, :as => :attachable

accepts_nested_attributes_for :attachments
end
{{< / highlight >}}

You have to pay attention to the attr_accessible for attacchments_attributes.
It won't work if you don't add that field to the list of accessible ones. And
eventually we modify the form in the following way:

{{< highlight erb >}}
<%= nested_form_for @article, :html=>{:multipart => true } do |f| %>
<%= f.error_messages %>

  <p>
  <%= f.label :title %><br />
  <%= f.text_field :title %>
  </p>
  <p>
  <%= f.label :description %><br />
  <%= f.text_area :description %>
  </p>
  <%= f.fields_for :attachments do |attachment_form|  %>
    <p>
    <%= attachment_form.label :description %><br />
    <%= attachment_form.text_area :description %>
    </p>
    <p>
    <%= attachment_form.label :file %><br />
    <%= attachment_form.file_field :file %>
    </p>
    <%= attachment_form.link_to_remove "Remove this attachment" %>
  <% end %>
  <%= f.link_to_add "Add attachment", :attachments %>
  <p><%= f.submit %></p>
 <% end %>
{{< / highlight >}}

And we're done!

I have created a [demo](https://github.com/lucapette/carrierwave-nested_form)
app just in case you want to play with it a bit.
