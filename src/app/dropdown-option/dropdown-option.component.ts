import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IDropdownOption } from './interfaces/IDropdownOption';

export type DropdownOptionChange = [id: string, state: boolean];

@Component({
  selector: 'app-dropdown-option',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-option.component.html',
  styleUrl: './dropdown-option.component.scss'
})
export class DropdownOptionComponent implements AfterViewInit {

  @Input() getCheckedState: (id: string) => boolean;
  @Input() option!: IDropdownOption;

  @Output() changeEvent = new EventEmitter<DropdownOptionChange>();

  @ViewChild('checkbox') checkbox: ElementRef<HTMLInputElement>;
  
  checked = true;

  onChange = (): void => {
    this.changeEvent.emit([this.option.id, this.checkbox.nativeElement.checked]);
  }

  public ngAfterViewInit(): void {
    this.checked = this.getCheckedState(this.option.id);
  }

}
