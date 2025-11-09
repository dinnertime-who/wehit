import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { DateField } from "./field-components/date-field";
import { ImageField } from "./field-components/image-field";
import { NumberField } from "./field-components/number-field";
import { PasswordField } from "./field-components/password-field";
import { SelectField } from "./field-components/select-field";
import { TextField } from "./field-components/text-field";
import { TiptapField } from "./field-components/tiptap-field";
import { VideoField } from "./field-components/video-field";
import { Fieldset } from "./form-components/fieldset";
import { SubmitButton } from "./form-components/submit-button";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
    PasswordField,
    SelectField,
    DateField,
    ImageField,
    TiptapField,
    VideoField,
  },
  formComponents: {
    SubmitButton,
    Fieldset,
  },
  fieldContext,
  formContext,
});

export { useAppForm, withForm, withFieldGroup };
export { useFieldContext, useFormContext };
