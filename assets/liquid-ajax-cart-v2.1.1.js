const t = "liquid-ajax-cart",
	e = "data-ajax-cart",
	n = "ajax-cart",
	o = "js-ajax-cart",
	i = `${t}:init`;
var r = function(t, e, n, o) {
	return new(n || (n = Promise))((function(i, r) {
		function s(t) {
			try {
				u(o.next(t))
			} catch (t) {
				r(t)
			}
		}

		function a(t) {
			try {
				u(o.throw(t))
			} catch (t) {
				r(t)
			}
		}

		function u(t) {
			var e;
			t.done ? i(t.value) : (e = t.value, e instanceof n ? e : new n((function(t) {
				t(e)
			}))).then(s, a)
		}
		u((o = o.apply(t, e || [])).next())
	}))
};
const s = "add",
	a = "change",
	u = "update",
	c = "clear",
	l = "get",
	d = `${t}:queue-start`,
	f = `${t}:queue-start-internal`,
	h = `${t}:queue-empty-internal`,
	p = `${t}:queue-end-internal`,
	m = `${t}:queue-end`,
	y = `${t}:request-start-internal`,
	v = `${t}:request-start`,
	b = `${t}:request-end-internal`,
	q = `${t}:request-end`,
	g = [];
let $ = !1;

function w(t) {
	var e;
	(null === (e = t.options) || void 0 === e ? void 0 : e.important) && 0 !== g.length ? g[0].push(t) : 1 === g.push([t]) && (E(!0), A())
}

function A() {
	if (1 === g.length && 0 === g[0].length) {
		const t = new CustomEvent(h);
		document.dispatchEvent(t)
	}
	if (0 === g.length) return void E(!1);
	if (0 === g[0].length) return g.shift(), void A();
	const {
		requestType: t,
		body: e,
		options: n
	} = g[0][0];
	! function(t, e, n, o) {
		const {
			extraRequestOnError: i
		} = W, a = k(t);
		let u;
		t !== l && (u = e || {});
		const c = t === l ? "GET" : "POST",
			d = n.info || {},
			f = {
				requestType: t,
				endpoint: a,
				requestBody: u,
				info: d
			},
			h = [],
			p = [],
			m = new CustomEvent(y, {
				detail: {
					requestState: {
						requestType: t,
						endpoint: a,
						info: d,
						requestBody: u
					}
				}
			});
		document.dispatchEvent(m);
		const b = new CustomEvent(v, {
			detail: {
				requestState: {
					requestType: t,
					endpoint: a,
					info: d,
					requestBody: u
				}
			}
		});
		if (document.dispatchEvent(b), d.cancel) return f.responseData = null, void L(n, o, f);
		if (void 0 !== u) {
			let e;
			if (u instanceof FormData || u instanceof URLSearchParams ? u.has("sections") && (e = u.get("sections").toString()) : e = u.sections, "string" == typeof e || e instanceof String || Array.isArray(e)) {
				if (Array.isArray(e) ? h.push(...e) : h.push(...e.split(",")), s === t && p.push(...h.slice(0, 5)), h.length > 5) {
					p.push(...h.slice(5));
					const t = h.slice(0, 5).join(",");
					u instanceof FormData || u instanceof URLSearchParams ? u.set("sections", t) : u.sections = t
				}
			} else null != e && console.error(`Liquid Ajax Cart: "sections" parameter in a Cart Ajax API request must be a string or an array. Now it is ${e}`)
		}
		const q = {
			method: c
		};
		t !== l && (u instanceof FormData || u instanceof URLSearchParams ? (q.body = u, q.headers = {
			"x-requested-with": "XMLHttpRequest"
		}) : (q.body = JSON.stringify(u), q.headers = {
			"Content-Type": "application/json"
		})), fetch(a, q).then((t => r(this, void 0, void 0, (function*() {
			const e = yield t.json();
			return {
				ok: t.ok,
				status: t.status,
				body: e
			}
		})))).then((t => r(this, void 0, void 0, (function*() {
			return f.responseData = t, !f.responseData.ok && i && p.unshift(...h.slice(0, 5)), p.length > 0 && (f.extraResponseData = yield j(p)), f
		})))).catch((t => {
			console.error("Liquid Ajax Cart: Error while performing cart Ajax request"), console.error(t), f.responseData = null, f.fetchError = t
		})).finally((() => {
			L(n, o, f)
		}))
	}(t, e, n, (() => {
		g[0].shift(), A()
	}))
}

function E(t) {
	$ = t;
	const e = new CustomEvent($ ? f : p);
	document.dispatchEvent(e);
	const n = new CustomEvent($ ? d : m);
	document.dispatchEvent(n)
}

function L(t, e, n) {
	if ("firstCallback" in t) try {
		t.firstCallback(n)
	} catch (t) {
		console.error('Liquid Ajax Cart: Error in request "firstCallback" function'), console.error(t)
	}
	const o = {
			requestState: n
		},
		i = new CustomEvent(b, {
			detail: o
		});
	document.dispatchEvent(i);
	const r = new CustomEvent(q, {
		detail: o
	});
	if (document.dispatchEvent(r), "lastCallback" in t) try {
		t.lastCallback(n)
	} catch (t) {
		console.error('Liquid Ajax Cart: Error in request "lastCallback" function'), console.error(t)
	}
	e()
}

function j(t = []) {
	const e = {};
	return t.length > 0 && (e.sections = t.slice(0, 5).join(",")), fetch(k(u), {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(e)
	}).then((e => e.json().then((n => {
		const o = {
			ok: e.ok,
			status: e.status,
			body: n
		};
		return t.length < 6 ? o : j(t.slice(5)).then((t => {
			var e;
			return t.ok && (null === (e = t.body) || void 0 === e ? void 0 : e.sections) && "object" == typeof t.body.sections && ("sections" in o.body || (o.body.sections = {}), o.body.sections = Object.assign(Object.assign({}, o.body.sections), t.body.sections)), o
		}))
	}))))
}

function S(t = {}) {
	w({
		requestType: l,
		body: void 0,
		options: t
	})
}

function x(t = {}, e = {}) {
	w({
		requestType: s,
		body: t,
		options: e
	})
}

function C(t = {}, e = {}) {
	w({
		requestType: a,
		body: t,
		options: e
	})
}

function T(t = {}, e = {}) {
	w({
		requestType: u,
		body: t,
		options: e
	})
}

function D(t = {}, e = {}) {
	w({
		requestType: c,
		body: t,
		options: e
	})
}

function k(t) {
	var e, n, o, i, r, d, f, h, p, m;
	switch (t) {
		case s:
			return `${(null===(n=null===(e=window.Shopify)||void 0===e?void 0:e.routes)||void 0===n?void 0:n.root)||"/"}cart/add.js`;
		case a:
			return `${(null===(i=null===(o=window.Shopify)||void 0===o?void 0:o.routes)||void 0===i?void 0:i.root)||"/"}cart/change.js`;
		case l:
			return `${(null===(d=null===(r=window.Shopify)||void 0===r?void 0:r.routes)||void 0===d?void 0:d.root)||"/"}cart.js`;
		case c:
			return `${(null===(h=null===(f=window.Shopify)||void 0===f?void 0:f.routes)||void 0===h?void 0:h.root)||"/"}cart/clear.js`;
		case u:
			return `${(null===(m=null===(p=window.Shopify)||void 0===p?void 0:p.routes)||void 0===m?void 0:m.root)||"/"}cart/update.js`;
		default:
			return
	}
}

function _() {
	return $
}
const O = `${e}-initial-state`;
let R, M = null;

function N() {
	return {
		cart: M,
		previousCart: R
	}
}
const B = `${e}-bind`;

function H() {
	N().cart && document.querySelectorAll(`[${B}]`).forEach((t => {
		const e = t.getAttribute(B);
		t.textContent = function(t) {
			const {
				binderFormatters: e
			} = W, [n, ...o] = t.split("|");
			let i = F(n, N().cart);
			return o.forEach((t => {
				const n = t.trim();
				"" !== n && ("object" == typeof e && n in e ? i = e[n](i) : n in P ? i = P[n](i) : console.warn(`Liquid Ajax Cart: the "${n}" formatter is not found`))
			})), "string" == typeof i || i instanceof String || "number" == typeof i || i instanceof Number ? i.toString() : (console.error(`Liquid Ajax Cart: the calculated value for the ${B}="${t}" element must be string or number. But the value is`, i), "")
		}(e)
	}))
}

function F(t, e) {
	const n = t.split("."),
		o = n.shift().trim();
	return "" !== o && o in e && n.length > 0 ? F(n.join("."), e[o]) : e[o]
}
const P = {
	money_with_currency: t => {
		var e;
		const n = N();
		if ("number" != typeof t && !(t instanceof Number)) return console.error("Liquid Ajax Cart: the 'money_with_currency' formatter is not applied because the value is not a number. The value is ", t), t;
		const o = t / 100;
		return "Intl" in window && (null === (e = window.Shopify) || void 0 === e ? void 0 : e.locale) ? Intl.NumberFormat(window.Shopify.locale, {
			style: "currency",
			currency: n.cart.currency
		}).format(o) : `${o.toFixed(2)} ${n.cart.currency}`
	}
};
let U, I = !1;

function J() {
	const {
		mutations: t
	} = W;
	Array.isArray(t) || console.error('Liquid Ajax Cart: the "mutations" settings parameter must be an array'), 0 !== t.length && (I = !1, U = -1, V())
}

function V() {
	const {
		mutations: t
	} = W;
	if (U++, U >= t.length) return;
	let e = [];
	try {
		const n = t[U]();
		n && (e = (null == n ? void 0 : n.requests) || [])
	} catch (t) {
		console.error(`Liquid Ajax Cart: Error in the "mutation" function with index ${U}`), console.error(t)
	}
	Array.isArray(e) ? Z(e) : V()
}

function Z(t) {
	const e = t.shift();
	if (e) {
		if (e.type && [s, a, u, c, l].includes(e.type)) return void w({
			requestType: e.type,
			body: e.body,
			options: {
				info: {
					initiator: "mutation"
				},
				important: !0,
				lastCallback: e => {
					Z(t)
				}
			}
		});
		console.error(`Liquid Ajax Cart: wrong request type in the mutation with index ${U}`)
	}
	t.length > 0 ? Z(t) : V()
}
const W = {
		binderFormatters: {},
		requestErrorText: "There was an error while updating your cart. Please try again.",
		updateOnWindowFocus: !0,
		quantityTagAllowZero: !1,
		quantityTagDebounce: 300,
		mutations: [],
		extraRequestOnError: !0
	},
	z = `${e}-section`,
	G = `${e}-static-element`,
	K = `${e}-section-scroll`,
	X = "shopify-section-",
	Q = `${n}-product-form`,
	Y = "processing";
class tt extends HTMLElement {
	connectedCallback() {
		var t, e;
		const n = this,
			o = this.querySelectorAll("form");
		if (1 !== o.length) return void console.error(`Liquid Ajax Cart: "${Q}" element must have one "form" element as a child, ${o.length} found`, n);
		const i = o[0];
		new URL(i.action).pathname === `${(null===(e=null===(t=window.Shopify)||void 0===t?void 0:t.routes)||void 0===e?void 0:e.root)||"/"}cart/add` ? i.addEventListener("submit", (t => {
			if (!n.hasAttribute(Y)) {
				const t = new FormData(i);
				n.setAttribute(Y, ""), x(t, {
					lastCallback: () => {
						n.removeAttribute(Y)
					},
					info: {
						initiator: n
					}
				})
			}
			t.preventDefault()
		})) : console.error(`Liquid Ajax Cart: "${Q}" element's form "action" attribute value isn't a product form action URL`, i, n)
	}
}
var et, nt, ot, it, rt, st, at, ut;
const ct = `${(null===(nt=null===(et=window.Shopify)||void 0===et?void 0:et.routes)||void 0===nt?void 0:nt.root)||"/"}cart/change`,
	lt = `${(null===(it=null===(ot=window.Shopify)||void 0===ot?void 0:ot.routes)||void 0===it?void 0:it.root)||"/"}cart/add`,
	dt = `${(null===(st=null===(rt=window.Shopify)||void 0===rt?void 0:rt.routes)||void 0===st?void 0:st.root)||"/"}cart/clear`,
	ft = `${(null===(ut=null===(at=window.Shopify)||void 0===at?void 0:at.routes)||void 0===ut?void 0:ut.root)||"/"}cart/update`,
	ht = `${e}-request-button`;

function pt(t, e) {
	let n;
	const o = [ct, lt, dt, ft];
	if (!t.hasAttribute(ht)) return;
	const i = t.getAttribute(ht);
	if (i) {
		let t;
		try {
			if (t = new URL(i, window.location.origin), !o.includes(t.pathname)) throw `URL should be one of the following: ${ct}, ${lt}, ${ft}, ${dt}`;
			n = t
		} catch (t) {
			console.error(`Liquid Ajax Cart: ${ht} contains an invalid URL as a parameter.`, t)
		}
	} else if (t instanceof HTMLAnchorElement && t.hasAttribute("href")) {
		const e = new URL(t.href);
		o.includes(e.pathname) ? n = e : t.hasAttribute(ht) && console.error(`Liquid Ajax Cart: a link with the ${ht} contains an invalid href URL.`, `URL should be one of the following: ${ct}, ${lt}, ${ft}, ${dt}`)
	}
	if (void 0 === n) return void console.error(`Liquid Ajax Cart: a ${ht} element doesn't have a valid URL`);
	if (e && e.preventDefault(), _()) return;
	const r = new FormData;
	switch (n.searchParams.forEach(((t, e) => {
			r.append(e, t)
		})), n.pathname) {
		case lt:
			x(r, {
				info: {
					initiator: t
				}
			});
			break;
		case ct:
			C(r, {
				info: {
					initiator: t
				}
			});
			break;
		case ft:
			T(r, {
				info: {
					initiator: t
				}
			});
			break;
		case dt:
			D({}, {
				info: {
					initiator: t
				}
			})
	}
}

function mt(t, e) {
	let n, o;
	return t.length > 3 ? (n = e.cart.items.find((e => e.key === t)), o = "id") : (n = e.cart.items[Number(t) - 1], o = "line"), void 0 === n && (n = null, console.error(`Liquid Ajax Cart: line item with ${o}="${t}" not found`)), [n, o]
}
const yt = `${e}-quantity-input`;

function vt(t) {
	return !(!t.hasAttribute(yt) || !(t instanceof HTMLInputElement && ["text", "number"].includes(t.type) || t instanceof HTMLSelectElement && ["select-one"].includes(t.type)) && (console.error(`Liquid Ajax Cart: the ${yt} attribute supports "input" elements of types "text", "number" and non-multiple "select" elements`), 1))
}

function bt() {
	document.querySelectorAll(`input[${yt}], select[${yt}]`).forEach((t => {
		if (!vt(t)) return;
		if (_()) return void(t.disabled = !0);
		const e = N(),
			n = t.getAttribute(yt).trim(),
			[o] = mt(n, e);
		o ? t.value = o.quantity.toString() : null === o && (t.value = "0"), t.disabled = !1
	}))
}

function qt(t, e) {
	if (!vt(t)) return;
	if (e && e.preventDefault(), _()) return;
	let n = Number(t.value.trim());
	const o = t.getAttribute(yt).trim();
	if (isNaN(n)) return void console.error(`Liquid Ajax Cart: input value of a ${yt} must be an Integer number`);
	if (n < 1 && (n = 0), !o) return void console.error(`Liquid Ajax Cart: attribute value of a ${yt} must be an item key or an item index`);
	const i = o.length > 3 ? "id" : "line",
		r = new FormData;
	r.set(i, o), r.set("quantity", n.toString()), C(r, {
		info: {
			initiator: t
		}
	}), t.blur()
}
const gt = `${e}-property-input`;

function $t(t) {
	const e = t.getAttribute(gt),
		n = t.getAttribute("name");
	console.error(`Liquid Ajax Cart: the element [${gt}="${e}"]${n?`[name="${n}"]`:""} has wrong attributes.`)
}

function wt(t) {
	return !!t.hasAttribute(gt) && !!(t instanceof HTMLInputElement && "hidden" !== t.type || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement)
}

function At(t) {
	const e = {
		objectCode: void 0,
		propertyName: void 0,
		attributeValue: void 0
	};
	if (!t.hasAttribute(gt)) return e;
	let n = t.getAttribute(gt).trim();
	if (!n) {
		const e = t.getAttribute("name").trim();
		e && (n = e)
	}
	if (!n) return $t(t), e;
	if (e.attributeValue = n, "note" === n) return e.objectCode = "note", e;
	let [o, ...i] = n.trim().split("[");
	return !i || 1 !== i.length || i[0].length < 2 || i[0].indexOf("]") !== i[0].length - 1 ? ($t(t), e) : (e.objectCode = o, e.propertyName = i[0].replace("]", ""), e)
}

function Et() {
	document.querySelectorAll(`[${gt}]`).forEach((t => {
		if (!wt(t)) return;
		if (_()) return void(t.disabled = !0);
		const {
			objectCode: e,
			propertyName: n,
			attributeValue: o
		} = At(t);
		if (!e) return;
		const i = N();
		let r, s = !1;
		if ("note" === e) r = i.cart.note;
		else if ("attributes" === e) r = i.cart.attributes[n];
		else {
			const [t, a] = mt(e, i);
			t && (r = t.properties[n]), null === t && (console.error(`Liquid Ajax Cart: line item with ${a}="${e}" was not found when the [${gt}] element with "${o}" value tried to get updated from the State`), s = !0)
		}
		t instanceof HTMLInputElement && ("checkbox" === t.type || "radio" === t.type) ? t.checked = t.value === r : ("string" == typeof r || r instanceof String || "number" == typeof r || r instanceof Number || (Array.isArray(r) || r instanceof Object ? (r = JSON.stringify(r), console.warn(`Liquid Ajax Cart: the ${gt} with the "${o}" value is bound to the ${n} ${"attributes"===e?"attribute":"property"} that is not string or number: ${r}`)) : r = ""), t.value = r), s || (t.disabled = !1)
	}))
}

function Lt(t, e) {
	if (!wt(t)) return;
	e && e.preventDefault(), t.blur();
	const n = N();
	if (_()) return;
	const {
		objectCode: o,
		propertyName: i,
		attributeValue: r
	} = At(t);
	if (!o) return;
	let s = t.value;
	if (t instanceof HTMLInputElement && "checkbox" === t.type && !t.checked) {
		let t = document.querySelector(`input[type="hidden"][${gt}="${r}"]`);
		t || "note" !== o && "attributes" !== o || (t = document.querySelector(`input[type="hidden"][${gt}][name="${r}"]`)), s = t ? t.value : ""
	}
	if ("note" === o) {
		const e = new FormData;
		e.set("note", s), T(e, {
			info: {
				initiator: t
			}
		})
	} else if ("attributes" === o) {
		const e = new FormData;
		e.set(`attributes[${i}]`, s), T(e, {
			info: {
				initiator: t
			}
		})
	} else {
		const [e, a] = mt(o, n);
		if (null === e && console.error(`Liquid Ajax Cart: line item with ${a}="${o}" was not found when the [${gt}] element with "${r}" value tried to update the cart`), !e) return;
		const u = Object.assign({}, e.properties);
		u[i] = s;
		const c = new FormData;
		let l = c;
		c.set(a, o), c.set("quantity", e.quantity.toString());
		for (let t in u) {
			const n = u[t];
			"string" == typeof n || n instanceof String ? c.set(`properties[${t}]`, u[t]) : l = {
				[a]: o,
				quantity: e.quantity,
				properties: u
			}
		}
		C(l, {
			info: {
				initiator: t
			}
		})
	}
}
const jt = `${n}-quantity`,
	St = `${e}-quantity-plus`,
	xt = `${e}-quantity-minus`;

function Ct() {
	customElements.define(Q, tt), document.addEventListener("click", (function(t) {
		for (let e = t.target; e && e != document.documentElement; e = e.parentElement) pt(e, t)
	}), !1), document.addEventListener("change", (function(t) {
		Lt(t.target, t)
	}), !1), document.addEventListener("keydown", (function(t) {
		const e = t.target;
		"Enter" === t.key && (e instanceof HTMLTextAreaElement && !t.ctrlKey || Lt(e, t)), "Escape" === t.key && function(t) {
			if (!wt(t)) return;
			if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) return;
			if (t instanceof HTMLInputElement && ("checkbox" === t.type || "radio" === t.type)) return;
			const e = N(),
				{
					objectCode: n,
					propertyName: o
				} = At(t);
			if (!n) return;
			let i;
			if ("note" === n) i = e.cart.note;
			else if ("attributes" === n) i = e.cart.attributes[o];
			else {
				const [t] = mt(n, e);
				t && (i = t.properties[o])
			}
			void 0 !== i && (i || "string" == typeof i || i instanceof String || (i = ""), t.value = String(i)), t.blur()
		}(e)
	}), !1), document.addEventListener(f, Et), document.addEventListener(b, Et), document.addEventListener(p, Et), Et(), document.addEventListener("change", (function(t) {
		qt(t.target, t)
	}), !1), document.addEventListener("keydown", (function(t) {
		"Enter" === t.key && qt(t.target, t), "Escape" === t.key && function(t) {
			if (!vt(t)) return;
			const e = t.getAttribute(yt).trim();
			let n;
			const o = N();
			if (e.length > 3) n = o.cart.items.find((t => t.key === e));
			else {
				const t = Number(e) - 1;
				n = o.cart.items[t]
			}
			n && (t.value = n.quantity.toString()), t.blur()
		}(t.target)
	}), !1), document.addEventListener(f, bt), document.addEventListener(b, bt), document.addEventListener(p, bt), bt(), customElements.define(jt, class extends HTMLElement {
		constructor() {
			super(...arguments), this._timer = void 0
		}
		connectedCallback() {
			const t = this.querySelectorAll("input");
			1 === t.length ? (this._$input = t[0], this._$input.hasAttribute(yt) ? (this._$buttons = Array.from(this.querySelectorAll(`[${xt}], [${St}]`)), this._$input.addEventListener("change", this._updateDOM.bind(this)), document.addEventListener(f, this._updateDOM.bind(this)), document.addEventListener(b, this._updateDOM.bind(this)), document.addEventListener(p, this._updateDOM.bind(this)), this._updateDOM(), this._$buttons.forEach((t => {
				t.addEventListener("click", (e => {
					const {
						quantityTagAllowZero: n
					} = W, o = !0 === n ? 0 : 1;
					if (!_()) {
						const e = Number(this._$input.value);
						if (isNaN(e)) return void console.error(`Liquid Ajax Cart: "${jt}" element's input value isn't a number`, this._$input, this);
						let n = e;
						n = t.hasAttribute(St) ? n + 1 : n - 1, n < o && (n = o), n !== e && (this._$input.value = n.toString(), this._runAwaiting(), this._updateDOM())
					}
					e.preventDefault()
				})), t.addEventListener("focusout", (e => {
					e.relatedTarget && t.contains(e.relatedTarget) || void 0 !== this._timer && this._runRequest()
				}))
			}))) : console.error(`Liquid Ajax Cart: "${jt}" element's input must have the "${yt}" attribute`, this._$input, this)) : console.error(`Liquid Ajax Cart: "${jt}" element must have one "input" element as a child, ${t.length} found`, this)
		}
		_runAwaiting() {
			const {
				quantityTagDebounce: t
			} = W;
			void 0 !== this._timer && clearTimeout(this._timer), t > 0 ? this._timer = setTimeout((() => {
				this._runRequest()
			}), Number(t)) : this._runRequest()
		}
		_runRequest() {
			void 0 !== this._timer && clearTimeout(this._timer), this._timer = void 0, _() || this._$input.dispatchEvent(new Event("change", {
				bubbles: !0
			}))
		}
		_updateDOM() {
			this._$buttons.forEach((t => {
				const e = _() || t.hasAttribute(xt) && !W.quantityTagAllowZero && "1" === this._$input.value;
				e ? t.setAttribute("aria-disabled", "true") : t.removeAttribute("aria-disabled"), t instanceof HTMLButtonElement && t.toggleAttribute("disabled", e)
			}))
		}
	})
}
const Tt = `${e}-errors`,
	Dt = t => {
		switch (t.requestType) {
			case s:
				return (t => {
					var e;
					const n = null === (e = t.info) || void 0 === e ? void 0 : e.initiator;
					return n instanceof tt ? Array.from(n.querySelectorAll(`[${Tt}="form"]`)) : []
				})(t);
			case a:
				return (t => {
					var e;
					const n = [],
						o = N();
					let i, r;
					if (t.requestBody instanceof FormData || t.requestBody instanceof URLSearchParams ? (t.requestBody.has("line") && (r = t.requestBody.get("line").toString()), t.requestBody.has("id") && (i = t.requestBody.get("id").toString())) : ("line" in t.requestBody && (r = String(t.requestBody.line)), "id" in t.requestBody && (i = String(t.requestBody.id))), r) {
						const t = Number(r);
						if (t > 0) {
							const n = t - 1;
							i = null === (e = o.cart.items[n]) || void 0 === e ? void 0 : e.key
						}
					}
					return i && (i.indexOf(":") > -1 ? n.push(...Array.from(document.querySelectorAll(`[${Tt}="${i}"]`))) : n.push(...Array.from(document.querySelectorAll(o.cart.items.reduce(((t, e) => (e.key !== i && e.id !== Number(i) || t.push(`[${Tt}="${e.key}"]`), t)), []).join(","))))), n
				})(t);
			default:
				return []
		}
	},
	kt = `${o}-init`,
	_t = `${o}-processing`,
	Ot = `${o}-empty`,
	Rt = `${o}-not-empty`;

function Mt() {
	const t = document.querySelector("html"),
		e = N();
	t.classList.toggle(kt, null !== e.cart), t.classList.toggle(_t, _()), t.classList.toggle(Ot, 0 === e.cart.item_count), t.classList.toggle(Rt, e.cart.item_count > 0)
}
let Nt = !1;
if (!("liquidAjaxCart" in window)) {
	function Bt(t, e) {
		Object.defineProperty(window.liquidAjaxCart, t, {
			get: e,
			set: () => {
				throw new Error(`Liquid Ajax Cart: the "${t}" is a read-only property`)
			},
			enumerable: !0
		})
	}
	window.liquidAjaxCart = {
			conf: function(t, e) {
				t in W ? (W[t] = e, window.liquidAjaxCart.init && ("binderFormatters" === t && H(), "mutations" === t && J())) : console.error(`Liquid Ajax Cart: unknown configuration parameter "${t}"`)
			}
		}, Bt("init", (() => Nt)), document.addEventListener(y, (t => {
			const {
				requestState: e
			} = t.detail;
			if (void 0 !== e.requestBody) {
				const t = [];
				if (document.querySelectorAll(`[${z}]`).forEach((e => {
						const n = e.closest(`[id^="${X}"]`);
						if (n) {
							const e = n.id.replace(X, ""); - 1 === t.indexOf(e) && t.push(e)
						} else console.error(`Liquid Ajax Cart: there is a ${z} element that is not inside a Shopify section. All the ${z} elements must be inside Shopify sections.`)
					})), t.length) {
					let n, o = t.join(",");
					e.requestBody instanceof FormData || e.requestBody instanceof URLSearchParams ? e.requestBody.has("sections") && (n = e.requestBody.get("sections").toString()) : n = e.requestBody.sections, (("string" == typeof n || n instanceof String) && "" !== n || n && Array.isArray(n) && n.length > 0) && (o = `${n.toString()},${o}`), e.requestBody instanceof FormData || e.requestBody instanceof URLSearchParams ? e.requestBody.set("sections", o) : e.requestBody.sections = o
				}
			}
		})), document.addEventListener(b, (t => {
			var e, n, o, i;
			t.detail.sections = [];
			const {
				requestState: r
			} = t.detail, a = new DOMParser, u = [];
			if (r.responseData.body.sections || (null === (n = null === (e = r.extraResponseData) || void 0 === e ? void 0 : e.body) || void 0 === n ? void 0 : n.sections)) {
				let t = r.responseData.body.sections;
				(null === (i = null === (o = r.extraResponseData) || void 0 === o ? void 0 : o.body) || void 0 === i ? void 0 : i.sections) && (t = Object.assign(Object.assign({}, t), r.extraResponseData.body.sections));
				for (let e in t) t[e] ? document.querySelectorAll(`#shopify-section-${e}`).forEach((n => {
					let o = [];
					const i = "__noId__",
						c = {};
					n.querySelectorAll(` [${K}] `).forEach((t => {
						let e = t.getAttribute(K).toString().trim();
						"" === e && (e = i), e in c || (c[e] = []), c[e].push({
							scroll: t.scrollTop,
							height: t.scrollHeight
						})
					}));
					const l = {},
						d = n.querySelectorAll(`[${G}]`);
					d && d.forEach((t => {
						let e = t.getAttribute(G).toString().trim();
						"" === e && (e = i), e in l || (l[e] = []), l[e].push(t)
					}));
					const f = n.querySelectorAll(`[${z}]`);
					if (f) {
						const r = a.parseFromString(t[e], "text/html");
						r.querySelectorAll('img[loading="lazy"]').forEach((t => {
							t.removeAttribute("loading")
						}));
						for (let t in l) r.querySelectorAll(` [${G}="${t.replace(i,"")}"] `).forEach(((e, n) => {
							n + 1 <= l[t].length && (e.before(l[t][n]), e.parentElement.removeChild(e))
						}));
						const s = r.querySelectorAll(`[${z}]`);
						if (f.length !== s.length) {
							console.error(`Liquid Ajax Cart: the received HTML for the "${e}" section has a different quantity of the "${z}" containers. The section will be updated completely.`);
							const t = r.querySelector(`#${X}${e}`);
							if (t) {
								for (n.innerHTML = ""; t.childNodes.length;) n.appendChild(t.firstChild);
								o.push(n)
							}
						} else f.forEach(((t, e) => {
							t.before(s[e]), t.parentElement.removeChild(t), o.push(s[e])
						}))
					}
					for (let t in c) n.querySelectorAll(` [${K}="${t.replace(i,"")}"] `).forEach(((e, n) => {
						n + 1 <= c[t].length && (r.requestType !== s || c[t][n].height >= e.scrollHeight) && (e.scrollTop = c[t][n].scroll)
					}));
					o.length > 0 && u.push({
						id: e,
						elements: o
					})
				})) : console.error(`Liquid Ajax Cart: the HTML for the "${e}" section was requested but the response is ${t[e]}`)
			}
			u.length > 0 && (t.detail.sections = u)
		})), document.addEventListener(y, (t => {
			const {
				requestState: e
			} = t.detail;
			Dt(e).forEach((t => {
				t.textContent = ""
			}))
		})), document.addEventListener(b, (t => {
			const {
				requestState: e
			} = t.detail;
			if (e.info.cancel) return;
			const n = Dt(e);
			if (0 === n.length) return;
			const o = function(t) {
				var e, n, o, i, r, s, a;
				const {
					requestErrorText: u
				} = W;
				if (null === (e = t.responseData) || void 0 === e ? void 0 : e.ok) return "";
				const c = (null === (o = null === (n = t.responseData) || void 0 === n ? void 0 : n.body) || void 0 === o ? void 0 : o.errors) || (null === (r = null === (i = t.responseData) || void 0 === i ? void 0 : i.body) || void 0 === r ? void 0 : r.description) || (null === (a = null === (s = t.responseData) || void 0 === s ? void 0 : s.body) || void 0 === a ? void 0 : a.message);
				return c ? "string" == typeof c ? c : "object" == typeof c ? Object.values(c).map((t => t.join(", "))).join("; ") : u : u
			}(e);
			o && n.forEach((t => {
				t.textContent = o
			}))
		})), document.addEventListener(i, J), document.addEventListener(h, (() => {
			I && J()
		})), document.addEventListener(y, (t => {
			const {
				requestState: e
			} = t.detail;
			"mutation" !== e.info.initiator && (I = !0)
		})),
		function() {
			document.addEventListener(b, (t => {
				var e, n;
				const {
					requestState: o
				} = t.detail;
				let i;
				(null === (e = o.extraResponseData) || void 0 === e ? void 0 : e.ok) && o.extraResponseData.body.token ? i = o.extraResponseData.body : (null === (n = o.responseData) || void 0 === n ? void 0 : n.ok) && o.responseData.body.token && (i = o.responseData.body), i && (R = M, M = i, t.detail.previousCart = R, t.detail.cart = M)
			}));
			const t = document.querySelector(`[${O}]`);
			if (t) try {
				M = JSON.parse(t.textContent)
			} catch (t) {
				console.error(`Liquid Ajax Cart: can't parse cart JSON from the "${O}" script`), console.error(t)
			}
			return new Promise(((t, e) => {
				var n, o;
				M ? t() : fetch(`${(null===(o=null===(n=window.Shopify)||void 0===n?void 0:n.routes)||void 0===o?void 0:o.root)||"/"}cart.js`, {
					headers: {
						"Content-Type": "application/json"
					}
				}).then((t => t.json())).then((e => {
					M = e, t()
				})).catch((t => {
					console.error(t), e('Can\'t load the cart state from the "/cart.js" endpoint')
				}))
			}))
		}().then((() => {
			document.addEventListener(b, H), H(), Ct(), document.addEventListener(f, Mt), document.addEventListener(b, Mt), document.addEventListener(p, Mt), Mt(), window.liquidAjaxCart.get = S, window.liquidAjaxCart.add = x, window.liquidAjaxCart.change = C, window.liquidAjaxCart.update = T, window.liquidAjaxCart.clear = D, Bt("cart", (() => N().cart)), Bt("processing", _), window.addEventListener("focus", (() => {
				W.updateOnWindowFocus && T({}, {})
			})), window.addEventListener("pageshow", (t => {
				(t.persisted || "back_forward" === performance.getEntriesByType("navigation")[0].type) && window.liquidAjaxCart.update({}, {})
			})), Nt = !0;
			const t = new CustomEvent(i);
			document.dispatchEvent(t)
		}))
}