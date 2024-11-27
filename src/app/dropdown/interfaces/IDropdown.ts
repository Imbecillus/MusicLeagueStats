import { IDropdownOption } from "../../dropdown-option/interfaces/IDropdownOption";

export interface IDropdown {

  columns: IDropdownCol[];
  title: string;

}

export interface IDropdownCol {

  options: IDropdownOption[];
  title?: string;

}
