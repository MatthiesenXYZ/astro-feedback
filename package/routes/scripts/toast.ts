if (!customElements.get('toast-message')) {
	class Toast extends HTMLElement {
		// This is called whenever a Toast element connects to the DOM
		connectedCallback() {
			this.show();
		}

		show() {
			this.isVisible = 'true';

			// If it's dismissible then we add a click listener to hide the toast
			if (this.isDismissible) {
				this.addEventListener('click', () => {
					this.hide(0);
				});

				// Otherwise we just hide it after 5 seconds
			} else {
				this.hide(5000);
			}
		}

		hide(delay: number) {
			setTimeout(() => {
				this.isVisible = 'false';
			}, delay);

			// 1 second after hiding the toast, we remove it from the DOM
			setTimeout(() => {
				this.remove();
			}, delay + 1000);
		}

		get isVisible() {
			return this.getAttribute('visible') || 'false';
		}

		set isVisible(visible) {
			this.setAttribute('visible', visible);
		}

		get isDismissible() {
			return this.getAttribute('dismissible') != null;
		}
	}

	customElements.define('toast-message', Toast);
}
