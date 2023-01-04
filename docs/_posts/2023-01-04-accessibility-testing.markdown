---
layout: post
title:  "Android automated accessibility testing critique"
date:   2023-01-05 00:00:00 +0000
categories: Accessibility, Testing, Unit tests
comments_id: 20
---
## Introduction

If your users can't tap the buttons in your app, they can't pay you money. If they can't read product descriptions, they'll be less likely to buy stuff **from you**. We cannot expect customers to constantly give feedback as to why they like some user interfaces over others, but there's actually little guesswork as to reason: _accessibility_. Ignoring a lot of little design elements has a cumulative impact on the erosion of user trust and frustration levels. It's a tough market out there, and the business of great experience is the mechanism by which empires will rise and fall. 

In this post I will be looking at automated user interface tests for Android that focus on accessibility, and make suggestions on how to improve their current state to benefit developers and users.

## Testing

Imagine, if you will, you want to test for your code. What would you do? You would (hopefully) do two kinds of tests to ensure that your code is funcationally acceptable:

1. performed the intended action or actions given reasonable inputs
2. does not break when given inputs that are unreasonable, but possible

Regardless of your approach (test driven development, writing tests after the code, testing it manually) this appears reasonable. Tried. Tested. Scientific.

The point of testing, as far as I have been able to gather, is all around _acceptance criteria_ and _usability_, a necessary subset of which is _accessibility_. Now, when we come to accessibility, the acceptance criteria are fairly stable. We know them from the [Web Content Accessibility Guidelines][0]. What the business needs to agree on is the level [A, AA, AAA][1] that they will support, but the guidelines themselves will not change.

## The Google Accessibility Test Framework

This is why, perhaps, it's easier to introduce a testing framework that attempts a "one command to test them all" approach, as seen in the [Google Accessibility Testing Framework (ATF)][2]:
{% highlight kotlin %}
import androidx.test.espresso.accessibility.AccessibilityChecks

@RunWith(AndroidJUnit4::class)
@LargeTest
class MyWelcomeWorkflowIntegrationTest {
    init {
        AccessibilityChecks.enable()
    }
}
{% endhighlight %}

This style of approach, one where the API has a singular method call to activate the tests, I will refer to as the "catch-all" approach. I have seen this is various automated accessibility test API's.

While I sincerely appreciate the efforts in accessibility and developer productivity, I think the catch-all approach in need of further discussion. I do, however, want to point out the positives first:
1. It's quick to implement
2. Scale: Many checks are done at once, with the possibility of adding more without developer intervention
3. Developers would need to [actively ignore][3] specific checks
4. Complex tests, like text color contrast (against the background) are done without needing additional implementation
5. Developers need zero knowledge to implement the test

These are not minor. At scale, this saves developers, especially ones in smaller companies with limited training and testing resources, a massive amount of time and effort in getting a basic level of the job done. At the very least they can have some information regarding the implementation of their accessibility and be informed when errors pop up. _If this is all you can do, it's the **least** you can do._

However, I think there are some vital elements missing from this approach. While this is a great start, it cannot be the first or last port of call.

## Missing intention

A good test (i.e. one that is falsifiable, stable, maintainable, repeatable and singularly responsible) should convey _intention_, not just so that it is easier to maintain and hand over, but also because it can be used to train newer developers. When the test fails, it should do so because a specific criteria has been removed or violated. Developer time is costly and resources spent doing mind-numbing actions should be minimized. If developers have to spend time diagnosing why a test failed by navigating through pages of stacked method calls, it becomes a burden. 

However, if the test has a name like `pay_button_has_minimum_touch_target_size()` and it fails, it becomes much easier to find the issue, either with the test or the code, and fix the problem. With a catch-all (`AccessibilityChecks.enable()`), developers would have to find the trace, navigate it, and decipher the specific issue from terms that they may or may not quite understand. Later I'll list the 14 different checks that could cause a failure (for more than one reason) and demonstrate that it can happen on entire subsections of the view hierarchy. 

The better solution would be to include an API that allows developers to be intentional, _even at the cost of potentially missing something,_ because these tests can be added to and maintained as needed. The issue with a lack of intention is that if the problems become annoying or numerous, another developer may simply turn them off, and with that turn **all of them off**. The problem with this kind of switch is that it works both ways, dangerously so.

A better test, especially in an existing system, is one where a change had an immediate intention that could be verified. For example, if a developer was told to make specific buttons adhere to touch target sizes, a test could be written to ensure that the change was done, and an Espresso matcher would be fairly simple to write, as in the code below.

<button type="button" class="collapsible" data-expands="section_code_touchtargetsizematcher">
TouchTargetSizeMatcher code snippet
</button>
<div id="section_code_touchtargetsizematcher" class="content">
{% highlight kotlin %}
import android.content.res.Resources
import android.util.TypedValue
import android.view.View
import org.hamcrest.Description
import org.hamcrest.TypeSafeMatcher

/**
 * [TypeSafeMatcher] which checks if a view has an appropriate touch target size
 * in accordance with accessibility best practice
 * 
 * WCAG 2.2 Success Criterion 2.5.8: Target Size (minimum) (Level AA)
 * 
 * @see https://support.google.com/accessibility/android/answer/7101858?hl=en
 * @see https://www.w3.org/TR/WCAG22/#target-size-minimum
 * 
 * usage: onView(withId(VIEW_ID)).check(matches(withValidTouchTargetSize()))
 */
class TouchTargetSizeMatcher : TypeSafeMatcher<View>() {
    override fun describeTo(description: Description?) {
        description?.appendText("View with minimum touch target size")
    }

    override fun matchesSafely(item: View): Boolean {
        // fail if item.layoutParams is null
        val layoutParams = item.layoutParams ?: return false
        val itemWidth = layoutParams.width
        val itemHeight = layoutParams.height

        return itemWidth >= minDp() && itemHeight >= minDp()
    }

    companion object {
        /**
         * Shorthand to match hamcrest convention for matchers
         *
         * @return an instance of [TouchTargetSizeMatcher]
         */
        fun withValidTouchTargetSize() = TouchTargetSizeMatcher()

        private const val MIN_TOUCH_SIZE = 48F

        /**
         * Converts pixel value to density independent pixels
         *
         * @return the minimum touch target size in density independent pixels
         */
        fun minDp(): Float =
            TypedValue.applyDimension(
                TypedValue.COMPLEX_UNIT_DIP,
                MIN_TOUCH_SIZE,
                Resources.getSystem().displayMetrics)
    }
}
{% endhighlight %}
</div>

An added benefit to this approach is that changes can be made _incrementally_ to the system, rather than performing a catch-all that would turn into a large amount of work and very large commits. An astute developer could even write code to generate a report showing which interactive elements have and have not been tested, and even create a lint check to ensure that buttons are tested at least once.

And while a [text-background colour contrast test][4] would be more complex to write, it is still possible to create.

## Mistakes at scale

The catch-all type testing is kind of like an "inversion of intention" approach: the intention is given to the parts that are unseen and left to the API, rather than allowing developers to incrementally face issues. The catch-all style is more 'waterfall' than it is 'agile': by adding these tests in the developers can be overwhelmed by the sheer amount of errors and would need to make large changes in order to get the test to pass.

Additionally, if the API implementation changes, either in the implementation of a pre-existing test, or the addition of a new test, it would scale to all the code in which the test takes place. In this case developers may choose to ignore the test rather than fixing it, and an action as seemingly simple as updating a library could have disastrous implications for the state of the tests.

While these tests don't have mistakes in them, they are not altogether entirely simple tests. Even if each one is O(1)*, it still runs on every view in a subset of the hierarchy, making it at least O(n) at best. And 14 tests on each node ensures that these tests are not going to be _fast_ to run, which is another reason why developers may turn them off.

Additionally, multiple tests might fail even though the cause was exactly the same. If the catch-all is turned on at the beginning of a series of flow tests, a single failure may propagate to several tests, and cause confusion around the root cause.

<sub>* "Big O notation" is an algorithm complexity classification system used in programming - as the value inside the brackets scales the algorithm becomes less desireable - O(1) being considered the most desireable. Read more on [Wikipedia][9]</sub>

## Developer benefit

I like to think that the work I do as an "android accessibility engineer" is "developer-aligned, user-centric." Developers need tools and knowledge to empower them to do an awesome job. We want developers to feel like they are working effectively and are not simply pumping out code to make more money for the "machine." If we rely on quick fixes, the bill does come up more expensive than if we had just done it properly from the beginning.

The user is the single most important aspect of any application. If they can't use it, they will likely use something else. The biggest problem is that developers aren't even great at making applications for other developers. They are great at making applications for developers like _themselves_, in ways **even they wouldn't be able to tell you**. Accessibility is the cornerstone of breaking that bias, and opening the playing field of usability for all types of users. 

By relying on a catch-all testing strategy developers will always be learning via the stick as opposed to the carrot. They just keep getting negative feedback. They keep getting told it's not good enough, and it's understandable that it is just easier to switch that off than be bombarded by a report that can change by something so insignificant as a version update.

## What's missing? ... hold on, what's included?

With the catch-all method, it's important to understand that the developer is not actually in control. The tests get run at some point for some reason. In the Google ATF, it's whenever a view action is performed:

> By default, the checks run when you perform any view action defined in [`ViewActions`][6]. Each check includes the view on which the action is performed as well as all descendant views. You can evaluate the entire view hierarchy of a screen during each check by passing true into [setRunChecksFromRootView(true)][7]

This is some fairly pertinent information that can be glazed over by anyone who would consider themselves in a rush to "get the library plugged in." It actually means two things:
1. Checks are **not done** until a [`ViewAction`][6] is performed - and developers who do not understand the term need to then navigate to a page for yet more information
2. Checks are done from the element _on which the action is performed and it's children_, not the entire view, unless specified

In addition, the documentation does not detail exactly what checks are done. It also doesn't mention what is missing, whether it be testable or not. Let me double down on an important aspect here: **accessibility cannot be only tested via automated tests** - there are some things, like nuances regarding headings (appropriate use, logical structure), keyboard navigation (tab-though) or accessibility menu options, that could be tested to some degree, could _never_ be covered by a catch-all. I went [into the code][8] and from what I can see here is what is tested:
1. _Class name_ - the class name of a view should be supported by accessibility services
2. _Clickable Span_ - `ClickableSpan`'s should not be used on a device running prior to Android O
3. _Duplicate Clickable Bounds_ - Containers should not be marked as clickable when they do not process click events themselves and only contain clickable children
4. _Duplicate Speakable Text_ - Two views with the same speakable text on a screen may confuse users
5. _Editable Content Description_ - Editable `TextView`s should not have a `contentDescription`
6. _Image Contrast Check_ - An image's foreground should have enough contrast against it's background
7. _Link Purpose Unclear_ - Ensure that common link label errors (stop words) are avoided (e.g. "here", "click", "tap")
8. _Redundant Description_ - Speakable text should not contain redundant or inappropriate information (e.g. view type, state, actions)
9. _Speakable Text Present_ - Views that require speakable text should have it
10. _Text Contrast_ - Text needs to have sufficient contrast against it's background
11. _Text Size_ - Text may have visibility problems related to text scaling
12. _Touch Target Size_ - The minimum size of an inter-actable component
13. _Transversal Order_ - Detect problems in the developer specified accessibility traversal ordering
14. _Unexposed Text_ - Check for finding those OCR recognized texts which are not exposed to Accessibility service

And while this is certainly a lot of great work, it's not 100%, both in what it covers, and in what is not covered at all. For example, a common mistake developers make is to add the word "heading" or "button" to a `contentDescription` instead of making components actual headings or buttons. The _Redundant Description_ check does not cover these cases. It may also not work for a language that is not included in the checks. There are a lot of caveats that are not mentioned!

Another point to relate is that a lot of the time, accessibility errors occur due to ignorance (not maleficence) - a lot of designers and developers are just sometimes unaware of the issue, or are a result of a communications breakdown. Just like all bugs, these things happen. However this should result in _intentional_ changes that are marked as such by specific tests (e.g. `pay_button_has_minimum_touch_target_size()`). Ignorance, however, is not an excuse for not doing the job properly. And if it's not accessible, it's simply not done.

## Conclusion

I don't want to downplay the amount of work and effort that goes into these types of test frameworks. They are amazing and please keep them coming. But please, don't try give me less to do, give me more so that I understand. And give me the freedom to choose the manner in which I approach a problem and can solve it at my own pace, and one part at a time. I feel like a good catch-all should rather be a report than a test that ends up feeling flaky. By attempting to remove accessibility from the developer mindset, we create a bigger divide between the creators and the users. The solution needs to be better than the problem.

[0]: https://www.w3.org/TR/WCAG21/
[1]: https://www.w3.org/WAI/WCAG2AA-Conformance
[2]: https://developer.android.com/guide/topics/ui/accessibility/testing#espresso
[3]: https://developer.android.com/guide/topics/ui/accessibility/testing#espresso-suppress-results
[4]: https://github.com/google/Accessibility-Test-Framework-for-Android/blob/master/src/main/java/com/google/android/apps/common/testing/accessibility/framework/checks/TextContrastCheck.java
[5]: https://developer.android.com/guide/topics/ui/accessibility/testing#espresso-enable-checks
[6]: https://developer.android.com/reference/androidx/test/espresso/action/ViewActions
[7]: https://github.com/google/Accessibility-Test-Framework-for-Android/blob/a6117fe0059c82dd764fa628d3817d724570f69e/src/main/java/com/google/android/apps/common/testing/accessibility/framework/integrations/espresso/AccessibilityValidator.java#L82
[8]: https://github.com/google/Accessibility-Test-Framework-for-Android/tree/master/src/main/java/com/google/android/apps/common/testing/accessibility/framework/checks
[9]: https://en.wikipedia.org/wiki/Big_O_notation
