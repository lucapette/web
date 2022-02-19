---
categories:
- ruby
date: "2011-03-08T00:00:00Z"
description: Why you should spend some time configuring IRB.
keywords: ruby, irb, console
title: Why you should spend some time configuring irb
---

Many of us have fallen in love with Ruby playing with irb. I’m such a person.
Ruby is a wonderful and powerful language, and you have to play with its
features many times to really understand what you can achieve with it. So I
think we all agree on the importance of irb. The interactive console is not
only a way to familiarize with the language but, in many cases, is a great
tool to improve one’s productivity. Indeed, it happens many times a day that
you run irb just to solve a doubt or to try an API.

## Why should I configure it?

In my opinion irb is powerful enough even without any particular
configuration. I have been used to a _raw_ irb for a long time and I think you
could use it in an efficient way. But I still think you should spend some time
configuring irb. The reasons are simple. Firstly, having personal irb
configurations is a boost for productivity. There are many tasks you perform
repeatedly when you are playing with an API or when you are trying Ruby
features. Configuring irb while focusing on your needs will save your time.
Secondly, spending time reading other configurations or thinking about your
needs is a very good learning opportunity.

The aim of this post is not _Hey folks, have a look at my config, it's so
beautiful!_ but I think we can use my config as an example of what you can
achieve configuring irb. I don’t like to recommend my configs to other people
but I won’t stop recommending making your tools more personal. Based on my
experience, a personal toolbox is a good way to boost productivity.

## What you can’t miss

Although I wouldn't recommend any particular configuration,  there are still
some things I think you should know about. As the history for example, you
want it, don’t you? Well, you can get the irb history in various ways. I show
the one I prefer below:

{{< highlight ruby >}}
require ‘irb/completion’
require 'irb/ext/save-history'

# where history is saved
IRB.conf[:HISTORY_FILE] = "#{ENV['HOME']}/.irb-history"
# how many lines to save
IRB.conf[:SAVE_HISTORY] = 1000
{{< / highlight >}}

I think there isn’t much to comment here. Irb history works quite like a sane
history does, you type something and then you can re-execute what you have
typed using up/down cursor to move in your history. Another thing you surely
want is bash-like completion, the first require gives completion to you.
Personally, I adore this feature :)

I think the above mentioned features are the only ones I would consider
generally unmissable but, consider it a matter of taste if you want, there is
a little gem I also consider unmissable and it’s
[map_by_method](http://drnicutilities.rubyforge.org/). Our dear drnic wrote it
some time ago and it’s still [a
classic](http://twitter.com/#!/drnic/status/42710458326728704). I think it’s
simpler to show a few examples that explain how it works with words. Here we
go:

{{< highlight ruby >}}
ruby-1.9.2-p0 > User.all.map_by_email
  User Load (0.1ms)  SELECT `users`.* FROM `users`
 => ["admin@admin.com", "test@example.com"]
ruby-1.9.2-p0 > User.all.map_by_email_and_roles
  User Load (0.1ms)  SELECT `users`.* FROM `users`
 => [["admin@admin.com", ["admin", "moderatore"]], ["test@example.com", []]
ruby-1.9.2-p0 > User.all.map_by_email_and_roles_and_login
  User Load (0.2ms)  SELECT `users`.* FROM `users`
 => [["admin@admin.com", ["admin", "moderatore"], "admin"], ["test@example.com", [],"test"]
ruby-1.9.2-p0 > a=%w{foo bar foobar baz qux}
 => ["foo", "bar", "foobar", "baz", "qux"]
ruby-1.9.2-p0 > a.map_by_reverse
 => ["oof", "rab", "raboof", "zab", "xuq"]
ruby-1.9.2-p0 > a.map_by_to_s_and_length
 => [["foo", 3], ["bar", 3], ["foobar", 6], ["baz", 3], ["qux", 3]]
{{< / highlight >}}

I think the example shown are self-describing, aren’t they? :)

## Something Interesting

So we talked about what I believe unmissable, now we can take a look at some
stuff that makes the configuring interesting. As a rails developer, I use the
console many times a day and I use it mainly to investigate on things I don’t
understand well. So, while thinking about improving my use of console, I
understood that I use some _console patterns_ like _create an array and test
the foo method_ or _create an hash to test the bar method_. And very often I
compare methods results on arrays or hashes. I think this is ordinary stuff we
all do with the console and I thought I needed a way to create _toys_ objects
more quickly than typing something like the following:

{{< highlight ruby >}}
ruby-1.9.2-p0 > a=[1,2,3,4,5,6,7,8,9,10]
 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
ruby-1.9.2-p0 > h={a: 1,b: 2,c: 3, d: 4,e: 5}
 => {:a=>1, :b=>2, :c=>3, :d=>4, :e=>5}
{{< / highlight >}}

So after a bit of time I came up with the following:

{{< highlight ruby >}}
ruby-1.9.2-p0 > Array.toy
 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
ruby-1.9.2-p0 > Array.toy(42)
 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]
ruby-1.9.2-p0 > Array.toy(42) {|e| (e + 1) * 2}
 => [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84]
ruby-1.9.2-p0 > Hash.toy
 => {1=>"a", 2=>"b", 3=>"c", 4=>"d", 5=>"e", 6=>"f", 7=>"g", 8=>"h", 9=>"i", 10=>"j"}
ruby-1.9.2-p0 > Hash.toy(26)
 => {1=>"a", 2=>"b", 3=>"c", 4=>"d", 5=>"e", 6=>"f", 7=>"g", 8=>"h", 9=>"i", 10=>"j", 11=>"k", 12=>"l", 13=>"m", 14=>"n", 15=>"o", 16=>"p", 17=>"q", 18=>"r", 19=>"s", 20=>"t", 21=>"u", 22=>"v", 23=>"w", 24=>"x", 25=>"y", 26=>"z"}
{{< / highlight >}}

Well, that isn’t very magic Ruby but it is very useful and it represented for
me a tiny opportunity to learn something "new":https://gist.github.com/807492.

If you are a Rails developer the odds are you use irb to investigate
ActiveRecord, in particular you would like to take a look at the SQL queries
generated by our beloved framework. Surely you can do something like the
following:

{{< highlight ruby >}}
ruby-1.9.2-p0 > Topic.approved.limit(1).to_sql
 => "SELECT  `topics`.* FROM `topics` WHERE (approved is true) ORDER BY created_at DESC LIMIT 1"
{{< / highlight >}}

and solve your problem but I see another opportunity to dig into irb. The
finest solution might be to redirect ActiveRecord logging in irb only when it
runs in a rails environment. Loading a file only when irb runs in a rails
environment is a very common problem, googling you can find many ways to solve
it. I solved it in the following way:

{{< highlight ruby >}}
# detects a rails console, cares about version
def rails?(*args)
    version=args.first
    v2 = ($0 == 'irb' && ENV['RAILS_ENV'])
    v3 = ($0 == 'script/rails' && Rails.env)
    version == 2 ? v2 : version == 3 ? v3 : v2 || v3
end

# loading rails configuration if it is running as a rails console
load File.dirname(__FILE__) + '/.railsrc' if rails?
{{< / highlight >}}

I wrote the rails? method because I’ve planned to do other rails-related stuff in my "irbrc":https://github.com/lucapette/dotfiles/blob/master/irbrc. The file loaded contains the methods that deal with ActiveRecord logging:

{{< highlight ruby >}}
# activerecord logging methods
# very useful for digging into
# queries
require 'logger'
require 'activerecord' if rails?(2)

def enable_logger
    log_to(Logger.new(STDOUT))
end

def disable_logger
    log_to(nil)
end

def log_to(logger)
    ActiveRecord::Base.logger = logger
    ActiveRecord::Base.clear_active_connections!
end

# logging into console by default
enable_logger
{{< / highlight >}}

I’ve chosen to enable logging by default because I really like the resulting behaviour:

{{< highlight ruby >}}
ruby-1.9.2-p0 > User.first
  User Load (0.1ms)  SELECT `users`.* FROM `users` LIMIT 1
 => #<User id: 1, email: "admin@example.com", created_at: "2010-12-16 14:46:49", updated_at: "2011-03-01 18:06:31", username: "admin", agency_id: nil>
ruby-1.9.2-p0 > Contract.joins(:user=>:agency).where("agencies.id = ?",Agency.find(1))
  Agency Load (0.4ms)  SELECT `agencies`.* FROM `agencies` WHERE (`agencies`.`id` = 1) LIMIT 1
  Contract Load (0.2ms)  SELECT `contracts`.* FROM `contracts` INNER JOIN `users` ON `users`.`id` = `contracts`.`user_id` INNER JOIN `agencies` ON `agencies`.`id` = `users`.`agency_id` WHERE (agencies.id = 1)
 => []
{{< / highlight >}}

## A simple conclusion

I think it’s fair to say we’ve covered most of the unmissable configuration
experiences. On this short path, I’ve learnt many things and they procreate
things I’ve planned to learn. Furthermore, while trying to implement the
features we have talked about, I read many configs, posts and articles. These
are the reason why I think you should spend some time configuring irb. You
will give a boost to your productivity and you will improve your knowledge. A
perfect match :)
