import type { ChangeEventHandler, RefObject } from 'react';

export interface UserInputComponentProps<InputElementType> {
  name: string;
  inputElementRef?: RefObject<InputElementType>;
  defaultValue?: string;
  invalid?: boolean;
  onChange?: ChangeEventHandler<InputElementType>;
  className?: string;
}