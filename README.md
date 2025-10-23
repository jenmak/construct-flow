# Construct Flow

## Requirements

1. Users are able to create projects (Already completed in the scaffold)
2. Users are able to fill out a questionnaire inside of the project describing the scope of work.
3. Once the questionnaire is filled out, the permit requirements are shown.
4. Leaving and coming back to the projet page should show the stored permit requirements.
5. (Optional, if time permits) Users should be able to update their questionnaire and show updated permit requirements.

The questionnaire should follow these business requirements:

### Scope of Work Questionnaire

#### Question 1: Work Type

> Always show this question first. Users can select multiple options.

What kind of work are you doing?

1. Interior work
2. Exterior work
3. Property additions

#### Question 2: Interior work details

> Only show if interior work is selected. Users can select multiple options.

What kind of interior work are you doing?

1. Flooring
1. Bathroom remodel
1. New bathroom
1. New laundry room
1. Electrical work
1. Other

#### Question 3: Exterior work details

> Only show if exterior work is selected. Users can select multiple options.

What kind of exterior work are you doing?

1. Roof modifications/repair
1. Garage door replacement
1. Deck construction
1. Garage modifications
1. Exterior doors
1. Fencing
1. Other

#### Question 4: Property addition details

> Only show if property addition is selected. Users can select **one** option.

1. ADU (Accessory dwelling unit)
2. Garage conversion
3. Basement/attic conversion
4. Other

#### Submit

Once the user is finished, they should be able to submit the form and get back the requirements. You'll need to show one of three requirements:

> ✅ **In-House Review Process**
>
> - A building permit is required.
> - Include plan sets.
> - Submit application for in-house review.

> ✅ **Over-the-Counter Submission Process**
>
> - A building permit is required.
> - Submit application for OTC review.

> ❌ **No Permit**
>
> - Nothing is required! You’re set to build.

### Requirements logic

#### In-House Review Required If Any Of:

- Any property addition work is selected (ADU, Garage conversion, etc.)
- New bathroom is selected
- New laundry room is selected
- If location is "San Francisco, CA" AND any structural work is selected (deck construction or garage modifications)
- Any "Other" option is selected in any category

#### OTC Review required If Any Of:

- Bathroom remodel
- Electrical work
- Roof modifications/repair
- If BOTH garage door replacement AND exterior doors are selected together

#### No Permit Required if:

- Not triggering full Review or OTC Review

#### Priority order:

1. Full Review
2. OTC Review
3. No Permit

- React: https://react.dev/learn
- tRPC: https://trpc.io/docs
- shadcn/ui: https://ui.shadcn.com/docs/components/radio-group
- Tailwind: https://tailwindcss.com/
