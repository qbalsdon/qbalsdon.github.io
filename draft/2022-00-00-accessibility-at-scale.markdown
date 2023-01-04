---
layout: post
title:  "Accessibility at scale: the value proposition"
date:   2022-07-20 00:00:00 +0000
categories: Accessibility, Metrics
comments_id: --
---
- The network effect
        - What is it?
        - Hamburgers are proof that scale is inverted at usability
- Numbers - what are they good for?
          - what are they bad for?
- Questions in good faith and bad faith
- Exclusion kills innovation
- When you've ignored an aspect of accessibility, you've normally removed something fundamental to the user experience. When I say "a screen reader user won't understand this" it is possible a lot of people would be left out, and the robustness and reusability of the code needs re-work (e.g. focus order applies to screen readers and keyboard users)

When developing software, it's often important to consider the scale of one's work. Investigating how many users are going to benefit from the features we produce is valuable information. It's informative on the value proposition as opposed to the amount of effort that could be applied. Many times, however, when managers, designers, developers and testers start down the line of pushing back on usability and accessibility, they are looking for justifications _not_ to do it. As advocates We need to start by challenging the bias appropriately. This is what I want to address in this article.

I would like to start with the heart of the discussion. Lets start by defining the _network effort_:

> Network effects are the incremental benefit gained by an existing user for each new user that joins the network. [0]

On the surface this is obvious, we get more users, we get more traffic, and the opportunity for revenue scales. The return on investment for effort is then related to to the number of users we can attract to our platform via certain features. Where the discussion can sometimes go sour, is when content creators decide that certain demographics are not "worth the effort" by including them. Calling folks out for their discrimination, while is a good thing to do, is a _moral_ response to a scientific question that is scientifically unfounded in the first place.

The network effect has another side to it: _network externality_, defined below. What is being described here is the fact that by excluding people we are not simply excluding the group, but the network surrounding that group. I believe that by understanding this advocates can put more substance into the response question "how many users are you willing to exclude."

> the demand for a product is dependent on the demand of others buying that product. [1]

This goes beyond the singluar number, clearly.

![A text input field with a black line under it. There is grey text inside that reads "Please enter your name"][101]

{% highlight xml %}
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Please type your name"/>
{% endhighlight %}


these single dimensional numbers can be erroneously applied in an attempt to allow exclusionary experiences to excuse apathetic engineering.

[0]: https://www.applicoinc.com/blog/network-effects/
[1]: https://www.investopedia.com/terms/n/network-effect.asp

[101]: /images/jc_a11y_placeholder.gif "Jetpack Compose TextField and Placeholder"
{: height="400px"}
