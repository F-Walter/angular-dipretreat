import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[flag]'
})
export class FlagDirective {
  private readonly OFFSET = 127397;

  constructor(private el:ElementRef, private renderer:Renderer2) {}

  ngAfterViewInit() {

  }

  private toFlag(code: string) {
    const base = 127462 - 65;
    const cc = code.toUpperCase();
    const res = String.fromCodePoint(...cc.split('').map(c => base + c.charCodeAt(0)));
    return res;
  }
}