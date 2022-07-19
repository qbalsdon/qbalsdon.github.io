---
layout: post
title:  "Android Accessibility: Labels and Hints"
date:   2022-07-20 00:00:00 +0000
categories: Android, Labels, Hints, Accessibility, Robust
comments_id: 19
---

Normally in Android development, you get handed a picture and are told to implement an interface. It can be fairly difficult to ascertain everything for a dynamic screen just from one design, and to make it worse, quite often Android developers have to "translate" these designs from an iPhone design.

Today I would like to discuss an aspect of development that is deceptively not-simple: hints and labels. If you had to ask me to differentiate between the two, I would say that a *label* is a standalone view that remains on the screen for users to identify another neighbouring component. Alternatively, a *hint* is a part of an input providing a description (and possibly an example) for the user as a non-essential guide that will disappear when they begin the input process.

I don't think hints and labels should have the same text inside them. Not only is it redundant to read, but folks using assistive technologies will experience the same text twice and it could add to confusion as to where the user is in the navigational tree.

## Marking labels with the `labelFor` attribute

The `labelFor` property documentation can be found in the [label specific accessibility documentation page][0] or inside the `attrs` class, which describes it as follows:

> Specifies the id of a view for which this view serves as a label for accessibility purposes. For example, a TextView before an EditText in the UI usually specifies what infomation (sic) is contained in the EditText. Hence, the TextView is a label for the EditText.

So why use it? It's just mark up! Well, it makes quite a difference to a screen reader user. Instead of announcing `Edit Box, Double tap to activate` it will now announce `Edit Box for *label text*, Double tap to activate` - which is incredibly useful information not requiring a hint. Not only that, there is an associative relationship between the components that may be useful in heavy handed refactoring. (Note: "Name" is a terrible label, "First Name" or "Full Name" would be much better)

{% highlight xml %}
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/label_name"
    android:labelFor="@id/input_name_plain_hint_label_for"/>

<EditText
    android:id="@+id/input_name_plain_hint_label_for"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"/>
{% endhighlight %}

The only thing I dislike about labels, is that they are part of the accessibility view hierarchy, and cannot be marked with `android:importantForAccessibility="no"` without negating them entirely. This means that they will be announced twice: Once when the view that is the label is highlighted and again when the view that they are labelling is highlighted. This can be mitigated if the user is using the `Control` granularity for movement.

If you would like an in depth perspective on labels, please read ["Labeling the point: Scenarios of label misuse in WCAG" by David Swallow][2] - even though it is HTML oriented the core concepts relate on a 1:1 basis with Android in this regard.

## Using hints

Hints are often seen as a mechanism for reducing the space used for inputs, i.e. we treat them as labels so that the view occupies less space than both a label and an input. This is useful when the input is some sort of text input or a button that leads to an input screen. However, it creates a problem when the input has been populated and the user loses the descriptive information. So if there is no label, they might have filled the form in incorrectly and not be aware of it. For example, first and last name inputs can appear in different orders.

![A text input field with a black line under it. There is grey text inside that reads "Please enter your name"][100]

{% highlight xml %}
<EditText
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Please type your name"/>
{% endhighlight %}

The advantage of a hint is that now developers and designers feel more comfortable using longer descriptions for the input. However non-screen reader users lose all that information unless they use `Material-Design` style inputs, where the hint floats above the control after being populated. The issue then reverts back to it being a label and perhaps not wanting a very long description.

## Announcement of hints and labels

When using a hint and a label on a `TextView` the announcement (in English) is announced as `*hint*, Edit box for *label*`. When there is already text populated in the edit box, the announcement is `Editing, *text*, Edit box *hint* for *label*` - the `for *label*` being ignored if there is no label and the `*hint*` being ignored if there is no hint. These are mutually exclusive, the presence of one does not affect the presence of the other.

When used appropriately, the usage of both hints and labels can inform users in a powerful way. However not understanding them or using them inappropriately can mean that users are left confused or feeling like they are in the wrong place.

### Hints and Jetpack Compose placeholders

It could be argued that Jetpack compose has replaced hints with placeholders, but even though the visual behaviour is similar, it does not work the same way with screen readers, yet. When declaring a `TextField` with a `placeholder`, the view behaves more like a `MaterialTextView` than an `EditText` with a `hint`. Additionally, and I think this is a bug not a feature, the hint is only announced once the element is tapped, lost focus, and then focussed again.

{% highlight kotlin %}
var text by rememberSaveable { mutableStateOf("") }
TextField(
    modifier = Modifier.fillMaxWidth(),
    value = text,
    label = { Text(labelText) },
    placeholder = { Text(hintText) },
    onValueChange = {
        text = it
    }
)
{% endhighlight %}

![A phone screen with TalkBack enabled. The screen has a label "Example in Jetpack Compose" and under it a field with the text "Name". When name is highlighted the screen reader announces "Edit Box, Name". When tapped the keyboard announcements are made. Only when focus is lost and regained by the edit box is the hint announced][101]

This does force the developer into a bit of design, and so hopefully there will be a future mechanism for a non-floating label. I did try to create my own but I don't think I'm ["thinking in Compose"][3] yet as the lack of view id's makes it difficult to create components that inter-relate independently of some sort of intermediary observer.

Please go read about [accessibility in Jetpack Compose][1], it's definitely worth your while!

## Conclusion

I would argue that a lot of this can come down to visual design, but designers and developers should be aware of the options and drawbacks. It's good to know that screen readers (in English anyway) announce the *hint*, component type, and then the *label*. Jetpack compose does have the concept of a hint, however there is a lot more design work that would need to be done on the developer side to shape the view into the desired outcome. The moral of the story is that a good label and hint should not simply thrust onto a screen without any thought.

### The WCAG Guidelines that were focussed on in this article:

> [1.3.1][131] [A] "The structural organization of a screen must be constructed in such a way that its information architecture makes sense to both those who see and those who hear the content."
>
> [1.3.2][132] [A] "Whatever the method of interaction, the presentation of information on the screen should always have a logical sequence."
>
> [1.3.5][135] [AA] "People should be clear about what to fill in form fields."
>
> [2.4.6][246] [AA] "All titles (different levels) and labels (fields of forms) must clearly describe the purpose of the contents or groupings on the screen elements without any ambiguity in their understanding."
>
> [2.5.3][253] [A] "Labels on buttons, actionable icons, or any interactive control, must have a meaningful description for both those who see and those who just hear the information."
>
> [3.3.2][332] [A] "All labels must clearly and unambiguously describe the purpose of the form fields."

[0]: https://developer.android.com/guide/topics/ui/accessibility/principles#label-elements
[1]: https://developer.android.com/jetpack/compose/accessibility
[2]: https://www.tpgi.com/labeling-the-point-scenarios-of-label-misuse-in-wcag/
[3]: https://developer.android.com/jetpack/compose/mental-model

[131]: https://www.w3.org/TR/WCAG21/#info-and-relationships
[132]: https://www.w3.org/TR/WCAG21/#meaningful-sequence
[135]: https://www.w3.org/TR/WCAG21/#identify-input-purpose
[246]: https://www.w3.org/TR/WCAG21/#headings-and-labels
[253]: https://www.w3.org/TR/WCAG21/#label-in-name
[332]: https://www.w3.org/TR/WCAG21/#labels-or-instructions

[100]: /images/edittext_hint.png "EditText with hint"
[101]: /images/jc_a11y_placeholder.gif "Jetpack Compose TextField and Placeholder"
{: height="400px"}
