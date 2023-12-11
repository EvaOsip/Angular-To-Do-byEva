import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[HashtagWords]'
})
export class HashtagWordsDirective implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const text = this.el.nativeElement.innerText;
    const newText = text.replace(/(#[a-zA-Zа-яА-Я0-9]+)/g, '<span style="color: red;">$1</span>');
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', newText);
  }
}

