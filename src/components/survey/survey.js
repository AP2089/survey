import rangesliderJs from 'rangeslider-js';
import Pristine from 'pristinejs';
import { axios } from '@/main';

export default class Survey {
  constructor(element) {
    this.element = element;
    this.form = element.querySelector('form');
    this.rangeElement = element.querySelector('.js-survey-range');
    this.bodyElement = element.querySelector('.js-survey-body');
    this.checkboxCategory = element.querySelectorAll('.js-checkbox-category');
    this.loader = this.createLoader();
    this.pristine = new Pristine(this.form);
    this.init();
  }

  init() {
    rangesliderJs.create(this.rangeElement, this.createRangeOptions.call(this));
    this.form.addEventListener('submit', this.submitForm.bind(this));
    this.checkboxCategory.forEach(e => e.addEventListener('change', this.changeCategory.bind(this)));
  }

  createLoader() {
    const loader = document.createElement('div');
    loader.classList.add('loader');

    return loader;
  }

  createRangeOptions() {
    const scope = this;

    return {
      onInit(value) {
        scope.changeRange.call(this, value, scope);
      },
      onSlide(value) {
        scope.changeRange.call(this, value, scope);
      }
    }
  }

  changeRange(value, scope) {
    this.handle.innerText = value;

    if (value > 6) {
      scope.bodyElement.classList.remove('active');
      scope.bodyElement.querySelectorAll('.js-checkbox-category-wrap').forEach(e => e.classList.remove('active'));
      scope.bodyElement.querySelectorAll('.js-checkbox-category, .js-checkbox-subcategory').forEach(e => e.checked = false);
      scope.pristine.reset();
    } else {
      scope.bodyElement.classList.add('active');
    }
  }

  changeCategory(event) {
    const wrap = event.target.closest('.js-checkbox-category-wrap');

    if (event.target.checked) {
      wrap.classList.add('active');
    } else {
      wrap.classList.remove('active');
      wrap.querySelectorAll('.js-checkbox-subcategory').forEach(e => e.checked = false);
    }
  }

  getErrorPosition(element) {
    return element.getBoundingClientRect().top + document.documentElement.scrollTop - 30;
  }

  async submitForm(event) {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);

      if (Number(formData.get('range')) <= 6) {
        const isValid = this.pristine.validate();

        if (!isValid) {
          const firstElementError = document.querySelector('.form-group.has-danger');

          if (firstElementError) {
            window.scrollTo({
              top: this.getErrorPosition(firstElementError),
              behavior: 'smooth'
            });
          }

          return false;
        }
      }

      document.body.append(this.loader);

      // const { data } = await axios.post(event.target.action, formData);

      this.form.classList.add('success');
      this.form.innerHTML = 'Form submitted successfully';
    } catch (error) {
      alert(error.message);
    } finally {
      this.loader.remove();
    }
  }
}