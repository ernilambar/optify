import TextField from './TextField';
import EmailField from './EmailField';
import UrlField from './UrlField';
import NumberField from './NumberField';
import PasswordField from './PasswordField';
import TextareaField from './TextareaField';
import RadioField from './RadioField';
import CheckboxField from './CheckboxField';
import SelectField from './SelectField';
import ToggleField from './ToggleField';
import MultiCheckField from './MultiCheckField';
import ButtonsetField from './ButtonsetField';
import SortableFieldType from './SortableFieldType';
import HeadingField from './HeadingField';
import MessageField from './MessageField';

export const fieldRegistry = {
    text: TextField,
    email: EmailField,
    url: UrlField,
    number: NumberField,
    password: PasswordField,
    textarea: TextareaField,
    radio: RadioField,
    checkbox: CheckboxField,
    select: SelectField,
    toggle: ToggleField,
    'multi-check': MultiCheckField,
    buttonset: ButtonsetField,
    sortable: SortableFieldType,
    heading: HeadingField,
    message: MessageField,
};

export default fieldRegistry;


