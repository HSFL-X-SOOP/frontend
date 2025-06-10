const ft = {
  /**
   * Triggered when an item is added to the collection.
   * @event module:ol/Collection.CollectionEvent#add
   * @api
   */
  ADD: "add",
  /**
   * Triggered when an item is removed from the collection.
   * @event module:ol/Collection.CollectionEvent#remove
   * @api
   */
  REMOVE: "remove"
}, wi = {
  /**
   * Triggered when a property is changed.
   * @event module:ol/Object.ObjectEvent#propertychange
   * @api
   */
  PROPERTYCHANGE: "propertychange"
}, z = {
  /**
   * Generic change event. Triggered when the revision counter is increased.
   * @event module:ol/events/Event~BaseEvent#change
   * @api
   */
  CHANGE: "change",
  /**
   * Generic error event. Triggered when an error occurs.
   * @event module:ol/events/Event~BaseEvent#error
   * @api
   */
  ERROR: "error",
  CONTEXTMENU: "contextmenu",
  CLICK: "click",
  DBLCLICK: "dblclick",
  KEYDOWN: "keydown",
  KEYPRESS: "keypress",
  LOAD: "load",
  TOUCHMOVE: "touchmove",
  WHEEL: "wheel"
};
class ts {
  constructor() {
    this.disposed = !1;
  }
  /**
   * Clean up.
   */
  dispose() {
    this.disposed || (this.disposed = !0, this.disposeInternal());
  }
  /**
   * Extension point for disposable objects.
   * @protected
   */
  disposeInternal() {
  }
}
function Kl(n, t, e) {
  let i, s;
  e = e || ge;
  let r = 0, o = n.length, a = !1;
  for (; r < o; )
    i = r + (o - r >> 1), s = +e(n[i], t), s < 0 ? r = i + 1 : (o = i, a = !s);
  return a ? r : ~r;
}
function ge(n, t) {
  return n > t ? 1 : n < t ? -1 : 0;
}
function Bl(n, t) {
  return n < t ? 1 : n > t ? -1 : 0;
}
function _r(n, t, e) {
  if (n[0] <= t)
    return 0;
  const i = n.length;
  if (t <= n[i - 1])
    return i - 1;
  if (typeof e == "function") {
    for (let s = 1; s < i; ++s) {
      const r = n[s];
      if (r === t)
        return s;
      if (r < t)
        return e(t, n[s - 1], r) > 0 ? s - 1 : s;
    }
    return i - 1;
  }
  if (e > 0) {
    for (let s = 1; s < i; ++s)
      if (n[s] < t)
        return s - 1;
    return i - 1;
  }
  if (e < 0) {
    for (let s = 1; s < i; ++s)
      if (n[s] <= t)
        return s;
    return i - 1;
  }
  for (let s = 1; s < i; ++s) {
    if (n[s] == t)
      return s;
    if (n[s] < t)
      return n[s - 1] - t < t - n[s] ? s - 1 : s;
  }
  return i - 1;
}
function Vl(n, t, e) {
  for (; t < e; ) {
    const i = n[t];
    n[t] = n[e], n[e] = i, ++t, --e;
  }
}
function Ji(n, t) {
  const e = Array.isArray(t) ? t : [t], i = e.length;
  for (let s = 0; s < i; s++)
    n[n.length] = e[s];
}
function Pe(n, t) {
  const e = n.length;
  if (e !== t.length)
    return !1;
  for (let i = 0; i < e; i++)
    if (n[i] !== t[i])
      return !1;
  return !0;
}
function Zl(n, t, e) {
  const i = t || ge;
  return n.every(function(s, r) {
    if (r === 0)
      return !0;
    const o = i(n[r - 1], s);
    return !(o > 0 || o === 0);
  });
}
function Ze() {
  return !0;
}
function fn() {
  return !1;
}
function Qi() {
}
function fa(n) {
  let t, e, i;
  return function() {
    const s = Array.prototype.slice.call(arguments);
    return (!e || this !== i || !Pe(s, e)) && (i = this, e = s, t = n.apply(this, arguments)), t;
  };
}
function Ul(n) {
  function t() {
    let e;
    try {
      e = n();
    } catch (i) {
      return Promise.reject(i);
    }
    return e instanceof Promise ? e : Promise.resolve(e);
  }
  return t();
}
function Li(n) {
  for (const t in n)
    delete n[t];
}
function Ci(n) {
  let t;
  for (t in n)
    return !1;
  return !t;
}
class se {
  /**
   * @param {string} type Type.
   */
  constructor(t) {
    this.propagationStopped, this.defaultPrevented, this.type = t, this.target = null;
  }
  /**
   * Prevent default. This means that no emulated `click`, `singleclick` or `doubleclick` events
   * will be fired.
   * @api
   */
  preventDefault() {
    this.defaultPrevented = !0;
  }
  /**
   * Stop event propagation.
   * @api
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
class es extends ts {
  /**
   * @param {*} [target] Default event target for dispatched events.
   */
  constructor(t) {
    super(), this.eventTarget_ = t, this.pendingRemovals_ = null, this.dispatching_ = null, this.listeners_ = null;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  addEventListener(t, e) {
    if (!t || !e)
      return;
    const i = this.listeners_ || (this.listeners_ = {}), s = i[t] || (i[t] = []);
    s.includes(e) || s.push(e);
  }
  /**
   * Dispatches an event and calls all listeners listening for events
   * of this type. The event parameter can either be a string or an
   * Object with a `type` property.
   *
   * @param {import("./Event.js").default|string} event Event object.
   * @return {boolean|undefined} `false` if anyone called preventDefault on the
   *     event object or if any of the listeners returned false.
   * @api
   */
  dispatchEvent(t) {
    const e = typeof t == "string", i = e ? t : t.type, s = this.listeners_ && this.listeners_[i];
    if (!s)
      return;
    const r = e ? new se(t) : (
      /** @type {Event} */
      t
    );
    r.target || (r.target = this.eventTarget_ || this);
    const o = this.dispatching_ || (this.dispatching_ = {}), a = this.pendingRemovals_ || (this.pendingRemovals_ = {});
    i in o || (o[i] = 0, a[i] = 0), ++o[i];
    let l;
    for (let c = 0, h = s.length; c < h; ++c)
      if ("handleEvent" in s[c] ? l = /** @type {import("../events.js").ListenerObject} */
      s[c].handleEvent(r) : l = /** @type {import("../events.js").ListenerFunction} */
      s[c].call(this, r), l === !1 || r.propagationStopped) {
        l = !1;
        break;
      }
    if (--o[i] === 0) {
      let c = a[i];
      for (delete a[i]; c--; )
        this.removeEventListener(i, Qi);
      delete o[i];
    }
    return l;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.listeners_ && Li(this.listeners_);
  }
  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {Array<import("../events.js").Listener>|undefined} Listeners.
   */
  getListeners(t) {
    return this.listeners_ && this.listeners_[t] || void 0;
  }
  /**
   * @param {string} [type] Type. If not provided,
   *     `true` will be returned if this event target has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener(t) {
    return this.listeners_ ? t ? t in this.listeners_ : Object.keys(this.listeners_).length > 0 : !1;
  }
  /**
   * @param {string} type Type.
   * @param {import("../events.js").Listener} listener Listener.
   */
  removeEventListener(t, e) {
    if (!this.listeners_)
      return;
    const i = this.listeners_[t];
    if (!i)
      return;
    const s = i.indexOf(e);
    s !== -1 && (this.pendingRemovals_ && t in this.pendingRemovals_ ? (i[s] = Qi, ++this.pendingRemovals_[t]) : (i.splice(s, 1), i.length === 0 && delete this.listeners_[t]));
  }
}
function U(n, t, e, i, s) {
  if (s) {
    const o = e;
    e = function(a) {
      return n.removeEventListener(t, e), o.call(i ?? this, a);
    };
  } else i && i !== n && (e = e.bind(i));
  const r = {
    target: n,
    type: t,
    listener: e
  };
  return n.addEventListener(t, e), r;
}
function zn(n, t, e, i) {
  return U(n, t, e, i, !0);
}
function tt(n) {
  n && n.target && (n.target.removeEventListener(n.type, n.listener), Li(n));
}
class gn extends es {
  constructor() {
    super(), this.on = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onInternal, this.once = /** @type {ObservableOnSignature<import("./events").EventsKey>} */
    this.onceInternal, this.un = /** @type {ObservableOnSignature<void>} */
    this.unInternal, this.revision_ = 0;
  }
  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  changed() {
    ++this.revision_, this.dispatchEvent(z.CHANGE);
  }
  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return {number} Revision.
   * @api
   */
  getRevision() {
    return this.revision_;
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onInternal(t, e) {
    if (Array.isArray(t)) {
      const i = t.length, s = new Array(i);
      for (let r = 0; r < i; ++r)
        s[r] = U(this, t[r], e);
      return s;
    }
    return U(
      this,
      /** @type {string} */
      t,
      e
    );
  }
  /**
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Event key.
   * @protected
   */
  onceInternal(t, e) {
    let i;
    if (Array.isArray(t)) {
      const s = t.length;
      i = new Array(s);
      for (let r = 0; r < s; ++r)
        i[r] = zn(this, t[r], e);
    } else
      i = zn(
        this,
        /** @type {string} */
        t,
        e
      );
    return e.ol_key = i, i;
  }
  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type Type.
   * @param {function((Event|import("./events/Event").default)): ?} listener Listener.
   * @protected
   */
  unInternal(t, e) {
    const i = (
      /** @type {Object} */
      e.ol_key
    );
    if (i)
      jl(i);
    else if (Array.isArray(t))
      for (let s = 0, r = t.length; s < r; ++s)
        this.removeEventListener(t[s], e);
    else
      this.removeEventListener(t, e);
  }
}
gn.prototype.on;
gn.prototype.once;
gn.prototype.un;
function jl(n) {
  if (Array.isArray(n))
    for (let t = 0, e = n.length; t < e; ++t)
      tt(n[t]);
  else
    tt(
      /** @type {import("./events.js").EventsKey} */
      n
    );
}
function j() {
  throw new Error("Unimplemented abstract method.");
}
let Hl = 0;
function B(n) {
  return n.ol_uid || (n.ol_uid = String(++Hl));
}
class so extends se {
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(t, e, i) {
    super(t), this.key = e, this.oldValue = i;
  }
}
class $t extends gn {
  /**
   * @param {Object<string, *>} [values] An object with key-value pairs.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, B(this), this.values_ = null, t !== void 0 && this.setProperties(t);
  }
  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get(t) {
    let e;
    return this.values_ && this.values_.hasOwnProperty(t) && (e = this.values_[t]), e;
  }
  /**
   * Get a list of object property names.
   * @return {Array<string>} List of property names.
   * @api
   */
  getKeys() {
    return this.values_ && Object.keys(this.values_) || [];
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>} Object.
   * @api
   */
  getProperties() {
    return this.values_ && Object.assign({}, this.values_) || {};
  }
  /**
   * Get an object of all property names and values.
   * @return {Object<string, *>?} Object.
   */
  getPropertiesInternal() {
    return this.values_;
  }
  /**
   * @return {boolean} The object has properties.
   */
  hasProperties() {
    return !!this.values_;
  }
  /**
   * @param {string} key Key name.
   * @param {*} oldValue Old value.
   */
  notify(t, e) {
    let i;
    i = `change:${t}`, this.hasListener(i) && this.dispatchEvent(new so(i, t, e)), i = wi.PROPERTYCHANGE, this.hasListener(i) && this.dispatchEvent(new so(i, t, e));
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  addChangeListener(t, e) {
    this.addEventListener(`change:${t}`, e);
  }
  /**
   * @param {string} key Key name.
   * @param {import("./events.js").Listener} listener Listener.
   */
  removeChangeListener(t, e) {
    this.removeEventListener(`change:${t}`, e);
  }
  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  set(t, e, i) {
    const s = this.values_ || (this.values_ = {});
    if (i)
      s[t] = e;
    else {
      const r = s[t];
      s[t] = e, r !== e && this.notify(t, r);
    }
  }
  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Object<string, *>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(t, e) {
    for (const i in t)
      this.set(i, t[i], e);
  }
  /**
   * Apply any properties from another object without triggering events.
   * @param {BaseObject} source The source object.
   * @protected
   */
  applyProperties(t) {
    t.values_ && Object.assign(this.values_ || (this.values_ = {}), t.values_);
  }
  /**
   * Unsets a property.
   * @param {string} key Key name.
   * @param {boolean} [silent] Unset without triggering an event.
   * @api
   */
  unset(t, e) {
    if (this.values_ && t in this.values_) {
      const i = this.values_[t];
      delete this.values_[t], Ci(this.values_) && (this.values_ = null), e || this.notify(t, i);
    }
  }
}
const ro = {
  LENGTH: "length"
};
class Cn extends se {
  /**
   * @param {import("./CollectionEventType.js").default} type Type.
   * @param {T} element Element.
   * @param {number} index The index of the added or removed element.
   */
  constructor(t, e, i) {
    super(t), this.element = e, this.index = i;
  }
}
class Ut extends $t {
  /**
   * @param {Array<T>} [array] Array.
   * @param {Options} [options] Collection options.
   */
  constructor(t, e) {
    if (super(), this.on, this.once, this.un, e = e || {}, this.unique_ = !!e.unique, this.array_ = t || [], this.unique_)
      for (let i = 0, s = this.array_.length; i < s; ++i)
        this.assertUnique_(this.array_[i], i);
    this.updateLength_();
  }
  /**
   * Remove all elements from the collection.
   * @api
   */
  clear() {
    for (; this.getLength() > 0; )
      this.pop();
  }
  /**
   * Add elements to the collection.  This pushes each item in the provided array
   * to the end of the collection.
   * @param {!Array<T>} arr Array.
   * @return {Collection<T>} This collection.
   * @api
   */
  extend(t) {
    for (let e = 0, i = t.length; e < i; ++e)
      this.push(t[e]);
    return this;
  }
  /**
   * Iterate over each element, calling the provided callback.
   * @param {function(T, number, Array<T>): *} f The function to call
   *     for every element. This function takes 3 arguments (the element, the
   *     index and the array). The return value is ignored.
   * @api
   */
  forEach(t) {
    const e = this.array_;
    for (let i = 0, s = e.length; i < s; ++i)
      t(e[i], i, e);
  }
  /**
   * Get a reference to the underlying Array object. Warning: if the array
   * is mutated, no events will be dispatched by the collection, and the
   * collection's "length" property won't be in sync with the actual length
   * of the array.
   * @return {!Array<T>} Array.
   * @api
   */
  getArray() {
    return this.array_;
  }
  /**
   * Get the element at the provided index.
   * @param {number} index Index.
   * @return {T} Element.
   * @api
   */
  item(t) {
    return this.array_[t];
  }
  /**
   * Get the length of this collection.
   * @return {number} The length of the array.
   * @observable
   * @api
   */
  getLength() {
    return this.get(ro.LENGTH);
  }
  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(t, e) {
    if (t < 0 || t > this.getLength())
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e), this.array_.splice(t, 0, e), this.updateLength_(), this.dispatchEvent(
      new Cn(ft.ADD, e, t)
    );
  }
  /**
   * Remove the last element of the collection and return it.
   * Return `undefined` if the collection is empty.
   * @return {T|undefined} Element.
   * @api
   */
  pop() {
    return this.removeAt(this.getLength() - 1);
  }
  /**
   * Insert the provided element at the end of the collection.
   * @param {T} elem Element.
   * @return {number} New length of the collection.
   * @api
   */
  push(t) {
    this.unique_ && this.assertUnique_(t);
    const e = this.getLength();
    return this.insertAt(e, t), this.getLength();
  }
  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(t) {
    const e = this.array_;
    for (let i = 0, s = e.length; i < s; ++i)
      if (e[i] === t)
        return this.removeAt(i);
  }
  /**
   * Remove the element at the provided index and return it.
   * Return `undefined` if the collection does not contain this index.
   * @param {number} index Index.
   * @return {T|undefined} Value.
   * @api
   */
  removeAt(t) {
    if (t < 0 || t >= this.getLength())
      return;
    const e = this.array_[t];
    return this.array_.splice(t, 1), this.updateLength_(), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Cn(ft.REMOVE, e, t)
    ), e;
  }
  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  setAt(t, e) {
    const i = this.getLength();
    if (t >= i) {
      this.insertAt(t, e);
      return;
    }
    if (t < 0)
      throw new Error("Index out of bounds: " + t);
    this.unique_ && this.assertUnique_(e, t);
    const s = this.array_[t];
    this.array_[t] = e, this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Cn(ft.REMOVE, s, t)
    ), this.dispatchEvent(
      /** @type {CollectionEvent<T>} */
      new Cn(ft.ADD, e, t)
    );
  }
  /**
   * @private
   */
  updateLength_() {
    this.set(ro.LENGTH, this.array_.length);
  }
  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  assertUnique_(t, e) {
    for (let i = 0, s = this.array_.length; i < s; ++i)
      if (this.array_[i] === t && i !== e)
        throw new Error("Duplicate item added to a unique collection");
  }
}
class hi extends se {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {?import("./Map.js").FrameState} [frameState] Frame state.
   */
  constructor(t, e, i) {
    super(t), this.map = e, this.frameState = i !== void 0 ? i : null;
  }
}
class Te extends hi {
  /**
   * @param {string} type Event type.
   * @param {import("./Map.js").default} map Map.
   * @param {EVENT} originalEvent Original event.
   * @param {boolean} [dragging] Is the map currently being dragged?
   * @param {import("./Map.js").FrameState} [frameState] Frame state.
   * @param {Array<PointerEvent>} [activePointers] Active pointers.
   */
  constructor(t, e, i, s, r, o) {
    super(t, e, r), this.originalEvent = i, this.pixel_ = null, this.coordinate_ = null, this.dragging = s !== void 0 ? s : !1, this.activePointers = o;
  }
  /**
   * The map pixel relative to the viewport corresponding to the original event.
   * @type {import("./pixel.js").Pixel}
   * @api
   */
  get pixel() {
    return this.pixel_ || (this.pixel_ = this.map.getEventPixel(this.originalEvent)), this.pixel_;
  }
  set pixel(t) {
    this.pixel_ = t;
  }
  /**
   * The coordinate corresponding to the original browser event.  This will be in the user
   * projection if one is set.  Otherwise it will be in the view projection.
   * @type {import("./coordinate.js").Coordinate}
   * @api
   */
  get coordinate() {
    return this.coordinate_ || (this.coordinate_ = this.map.getCoordinateFromPixel(this.pixel)), this.coordinate_;
  }
  set coordinate(t) {
    this.coordinate_ = t;
  }
  /**
   * Prevents the default browser action.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.preventDefault.
   * @api
   * @override
   */
  preventDefault() {
    super.preventDefault(), "preventDefault" in this.originalEvent && this.originalEvent.preventDefault();
  }
  /**
   * Prevents further propagation of the current event.
   * See https://developer.mozilla.org/en-US/docs/Web/API/event.stopPropagation.
   * @api
   * @override
   */
  stopPropagation() {
    super.stopPropagation(), "stopPropagation" in this.originalEvent && this.originalEvent.stopPropagation();
  }
}
const et = {
  /**
   * A true single click with no dragging and no double click. Note that this
   * event is delayed by 250 ms to ensure that it is not a double click.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#singleclick
   * @api
   */
  SINGLECLICK: "singleclick",
  /**
   * A click with no dragging. A double click will fire two of this.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#click
   * @api
   */
  CLICK: z.CLICK,
  /**
   * A true double click, with no dragging.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#dblclick
   * @api
   */
  DBLCLICK: z.DBLCLICK,
  /**
   * Triggered when a pointer is dragged.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointerdrag
   * @api
   */
  POINTERDRAG: "pointerdrag",
  /**
   * Triggered when a pointer is moved. Note that on touch devices this is
   * triggered when the map is panned, so is not the same as mousemove.
   * @event module:ol/MapBrowserEvent~MapBrowserEvent#pointermove
   * @api
   */
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTEROVER: "pointerover",
  POINTEROUT: "pointerout",
  POINTERENTER: "pointerenter",
  POINTERLEAVE: "pointerleave",
  POINTERCANCEL: "pointercancel"
}, Ue = typeof navigator < "u" && typeof navigator.userAgent < "u" ? navigator.userAgent.toLowerCase() : "", $l = Ue.includes("safari") && !Ue.includes("chrom");
$l && (Ue.includes("version/15.4") || /cpu (os|iphone os) 15_4 like mac os x/.test(Ue));
const ql = Ue.includes("webkit") && !Ue.includes("edge"), ga = Ue.includes("macintosh"), Jl = typeof devicePixelRatio < "u" ? devicePixelRatio : 1, _a = typeof WorkerGlobalScope < "u" && typeof OffscreenCanvas < "u" && self instanceof WorkerGlobalScope, ma = typeof Image < "u" && Image.prototype.decode, pa = function() {
  let n = !1;
  try {
    const t = Object.defineProperty({}, "passive", {
      get: function() {
        n = !0;
      }
    });
    window.addEventListener("_", null, t), window.removeEventListener("_", null, t);
  } catch {
  }
  return n;
}(), Qs = {
  POINTERMOVE: "pointermove",
  POINTERDOWN: "pointerdown"
};
class Ql extends es {
  /**
   * @param {import("./Map.js").default} map The map with the viewport to listen to events on.
   * @param {number} [moveTolerance] The minimal distance the pointer must travel to trigger a move.
   */
  constructor(t, e) {
    super(t), this.map_ = t, this.clickTimeoutId_, this.emulateClicks_ = !1, this.dragging_ = !1, this.dragListenerKeys_ = [], this.moveTolerance_ = e === void 0 ? 1 : e, this.down_ = null;
    const i = this.map_.getViewport();
    this.activePointers_ = [], this.trackedTouches_ = {}, this.element_ = i, this.pointerdownListenerKey_ = U(
      i,
      Qs.POINTERDOWN,
      this.handlePointerDown_,
      this
    ), this.originalPointerMoveEvent_, this.relayedListenerKey_ = U(
      i,
      Qs.POINTERMOVE,
      this.relayMoveEvent_,
      this
    ), this.boundHandleTouchMove_ = this.handleTouchMove_.bind(this), this.element_.addEventListener(
      z.TOUCHMOVE,
      this.boundHandleTouchMove_,
      pa ? { passive: !1 } : !1
    );
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  emulateClick_(t) {
    let e = new Te(
      et.CLICK,
      this.map_,
      t
    );
    this.dispatchEvent(e), this.clickTimeoutId_ !== void 0 ? (clearTimeout(this.clickTimeoutId_), this.clickTimeoutId_ = void 0, e = new Te(
      et.DBLCLICK,
      this.map_,
      t
    ), this.dispatchEvent(e)) : this.clickTimeoutId_ = setTimeout(() => {
      this.clickTimeoutId_ = void 0;
      const i = new Te(
        et.SINGLECLICK,
        this.map_,
        t
      );
      this.dispatchEvent(i);
    }, 250);
  }
  /**
   * Keeps track on how many pointers are currently active.
   *
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  updateActivePointers_(t) {
    const e = t, i = e.pointerId;
    if (e.type == et.POINTERUP || e.type == et.POINTERCANCEL) {
      delete this.trackedTouches_[i];
      for (const s in this.trackedTouches_)
        if (this.trackedTouches_[s].target !== e.target) {
          delete this.trackedTouches_[s];
          break;
        }
    } else (e.type == et.POINTERDOWN || e.type == et.POINTERMOVE) && (this.trackedTouches_[i] = e);
    this.activePointers_ = Object.values(this.trackedTouches_);
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerUp_(t) {
    this.updateActivePointers_(t);
    const e = new Te(
      et.POINTERUP,
      this.map_,
      t,
      void 0,
      void 0,
      this.activePointers_
    );
    this.dispatchEvent(e), this.emulateClicks_ && !e.defaultPrevented && !this.dragging_ && this.isMouseActionButton_(t) && this.emulateClick_(this.down_), this.activePointers_.length === 0 && (this.dragListenerKeys_.forEach(tt), this.dragListenerKeys_.length = 0, this.dragging_ = !1, this.down_ = null);
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @return {boolean} If the left mouse button was pressed.
   * @private
   */
  isMouseActionButton_(t) {
    return t.button === 0;
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerDown_(t) {
    this.emulateClicks_ = this.activePointers_.length === 0, this.updateActivePointers_(t);
    const e = new Te(
      et.POINTERDOWN,
      this.map_,
      t,
      void 0,
      void 0,
      this.activePointers_
    );
    if (this.dispatchEvent(e), this.down_ = new PointerEvent(t.type, t), Object.defineProperty(this.down_, "target", {
      writable: !1,
      value: t.target
    }), this.dragListenerKeys_.length === 0) {
      const i = this.map_.getOwnerDocument();
      this.dragListenerKeys_.push(
        U(
          i,
          et.POINTERMOVE,
          this.handlePointerMove_,
          this
        ),
        U(i, et.POINTERUP, this.handlePointerUp_, this),
        /* Note that the listener for `pointercancel is set up on
         * `pointerEventHandler_` and not `documentPointerEventHandler_` like
         * the `pointerup` and `pointermove` listeners.
         *
         * The reason for this is the following: `TouchSource.vacuumTouches_()`
         * issues `pointercancel` events, when there was no `touchend` for a
         * `touchstart`. Now, let's say a first `touchstart` is registered on
         * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
         * But `documentPointerEventHandler_` doesn't know about the first
         * `touchstart`. If there is no `touchend` for the `touchstart`, we can
         * only receive a `touchcancel` from `pointerEventHandler_`, because it is
         * only registered there.
         */
        U(
          this.element_,
          et.POINTERCANCEL,
          this.handlePointerUp_,
          this
        )
      ), this.element_.getRootNode && this.element_.getRootNode() !== i && this.dragListenerKeys_.push(
        U(
          this.element_.getRootNode(),
          et.POINTERUP,
          this.handlePointerUp_,
          this
        )
      );
    }
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  handlePointerMove_(t) {
    if (this.isMoving_(t)) {
      this.updateActivePointers_(t), this.dragging_ = !0;
      const e = new Te(
        et.POINTERDRAG,
        this.map_,
        t,
        this.dragging_,
        void 0,
        this.activePointers_
      );
      this.dispatchEvent(e);
    }
  }
  /**
   * Wrap and relay a pointermove event.
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @private
   */
  relayMoveEvent_(t) {
    this.originalPointerMoveEvent_ = t;
    const e = !!(this.down_ && this.isMoving_(t));
    this.dispatchEvent(
      new Te(
        et.POINTERMOVE,
        this.map_,
        t,
        e
      )
    );
  }
  /**
   * Flexible handling of a `touch-action: none` css equivalent: because calling
   * `preventDefault()` on a `pointermove` event does not stop native page scrolling
   * and zooming, we also listen for `touchmove` and call `preventDefault()` on it
   * when an interaction (currently `DragPan` handles the event.
   * @param {TouchEvent} event Event.
   * @private
   */
  handleTouchMove_(t) {
    const e = this.originalPointerMoveEvent_;
    (!e || e.defaultPrevented) && (typeof t.cancelable != "boolean" || t.cancelable === !0) && t.preventDefault();
  }
  /**
   * @param {PointerEvent} pointerEvent Pointer
   * event.
   * @return {boolean} Is moving.
   * @private
   */
  isMoving_(t) {
    return this.dragging_ || Math.abs(t.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(t.clientY - this.down_.clientY) > this.moveTolerance_;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.relayedListenerKey_ && (tt(this.relayedListenerKey_), this.relayedListenerKey_ = null), this.element_.removeEventListener(
      z.TOUCHMOVE,
      this.boundHandleTouchMove_
    ), this.pointerdownListenerKey_ && (tt(this.pointerdownListenerKey_), this.pointerdownListenerKey_ = null), this.dragListenerKeys_.forEach(tt), this.dragListenerKeys_.length = 0, this.element_ = null, super.disposeInternal();
  }
}
const de = {
  /**
   * Triggered after a map frame is rendered.
   * @event module:ol/MapEvent~MapEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered when the map starts moving.
   * @event module:ol/MapEvent~MapEvent#movestart
   * @api
   */
  MOVESTART: "movestart",
  /**
   * Triggered after the map is moved.
   * @event module:ol/MapEvent~MapEvent#moveend
   * @api
   */
  MOVEEND: "moveend",
  /**
   * Triggered when loading of additional map data (tiles, images, features) starts.
   * @event module:ol/MapEvent~MapEvent#loadstart
   * @api
   */
  LOADSTART: "loadstart",
  /**
   * Triggered when loading of additional map data has completed.
   * @event module:ol/MapEvent~MapEvent#loadend
   * @api
   */
  LOADEND: "loadend"
}, yt = {
  LAYERGROUP: "layergroup",
  SIZE: "size",
  TARGET: "target",
  VIEW: "view"
}, O = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3,
  EMPTY: 4
};
function $(n, t) {
  if (!n)
    throw new Error(t);
}
const Wn = 1 / 0;
class th {
  /**
   * @param {function(T): number} priorityFunction Priority function.
   * @param {function(T): string} keyFunction Key function.
   */
  constructor(t, e) {
    this.priorityFunction_ = t, this.keyFunction_ = e, this.elements_ = [], this.priorities_ = [], this.queuedElements_ = {};
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.elements_.length = 0, this.priorities_.length = 0, Li(this.queuedElements_);
  }
  /**
   * Remove and return the highest-priority element. O(log N).
   * @return {T} Element.
   */
  dequeue() {
    const t = this.elements_, e = this.priorities_, i = t[0];
    t.length == 1 ? (t.length = 0, e.length = 0) : (t[0] = /** @type {T} */
    t.pop(), e[0] = /** @type {number} */
    e.pop(), this.siftUp_(0));
    const s = this.keyFunction_(i);
    return delete this.queuedElements_[s], i;
  }
  /**
   * Enqueue an element. O(log N).
   * @param {T} element Element.
   * @return {boolean} The element was added to the queue.
   */
  enqueue(t) {
    $(
      !(this.keyFunction_(t) in this.queuedElements_),
      "Tried to enqueue an `element` that was already added to the queue"
    );
    const e = this.priorityFunction_(t);
    return e != Wn ? (this.elements_.push(t), this.priorities_.push(e), this.queuedElements_[this.keyFunction_(t)] = !0, this.siftDown_(0, this.elements_.length - 1), !0) : !1;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.elements_.length;
  }
  /**
   * Gets the index of the left child of the node at the given index.
   * @param {number} index The index of the node to get the left child for.
   * @return {number} The index of the left child.
   * @private
   */
  getLeftChildIndex_(t) {
    return t * 2 + 1;
  }
  /**
   * Gets the index of the right child of the node at the given index.
   * @param {number} index The index of the node to get the right child for.
   * @return {number} The index of the right child.
   * @private
   */
  getRightChildIndex_(t) {
    return t * 2 + 2;
  }
  /**
   * Gets the index of the parent of the node at the given index.
   * @param {number} index The index of the node to get the parent for.
   * @return {number} The index of the parent.
   * @private
   */
  getParentIndex_(t) {
    return t - 1 >> 1;
  }
  /**
   * Make this a heap. O(N).
   * @private
   */
  heapify_() {
    let t;
    for (t = (this.elements_.length >> 1) - 1; t >= 0; t--)
      this.siftUp_(t);
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.elements_.length === 0;
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Is key queued.
   */
  isKeyQueued(t) {
    return t in this.queuedElements_;
  }
  /**
   * @param {T} element Element.
   * @return {boolean} Is queued.
   */
  isQueued(t) {
    return this.isKeyQueued(this.keyFunction_(t));
  }
  /**
   * @param {number} index The index of the node to move down.
   * @private
   */
  siftUp_(t) {
    const e = this.elements_, i = this.priorities_, s = e.length, r = e[t], o = i[t], a = t;
    for (; t < s >> 1; ) {
      const l = this.getLeftChildIndex_(t), c = this.getRightChildIndex_(t), h = c < s && i[c] < i[l] ? c : l;
      e[t] = e[h], i[t] = i[h], t = h;
    }
    e[t] = r, i[t] = o, this.siftDown_(a, t);
  }
  /**
   * @param {number} startIndex The index of the root.
   * @param {number} index The index of the node to move up.
   * @private
   */
  siftDown_(t, e) {
    const i = this.elements_, s = this.priorities_, r = i[e], o = s[e];
    for (; e > t; ) {
      const a = this.getParentIndex_(e);
      if (s[a] > o)
        i[e] = i[a], s[e] = s[a], e = a;
      else
        break;
    }
    i[e] = r, s[e] = o;
  }
  /**
   * FIXME empty description for jsdoc
   */
  reprioritize() {
    const t = this.priorityFunction_, e = this.elements_, i = this.priorities_;
    let s = 0;
    const r = e.length;
    let o, a, l;
    for (a = 0; a < r; ++a)
      o = e[a], l = t(o), l == Wn ? delete this.queuedElements_[this.keyFunction_(o)] : (i[s] = l, e[s++] = o);
    e.length = s, i.length = s, this.heapify_();
  }
}
class eh extends th {
  /**
   * @param {PriorityFunction} tilePriorityFunction Tile priority function.
   * @param {function(): ?} tileChangeCallback Function called on each tile change event.
   */
  constructor(t, e) {
    super(
      (i) => t.apply(null, i),
      (i) => i[0].getKey()
    ), this.boundHandleTileChange_ = this.handleTileChange.bind(this), this.tileChangeCallback_ = e, this.tilesLoading_ = 0, this.tilesLoadingKeys_ = {};
  }
  /**
   * @param {TileQueueElement} element Element.
   * @return {boolean} The element was added to the queue.
   * @override
   */
  enqueue(t) {
    const e = super.enqueue(t);
    return e && t[0].addEventListener(z.CHANGE, this.boundHandleTileChange_), e;
  }
  /**
   * @return {number} Number of tiles loading.
   */
  getTilesLoading() {
    return this.tilesLoading_;
  }
  /**
   * @param {import("./events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(t) {
    const e = (
      /** @type {import("./Tile.js").default} */
      t.target
    ), i = e.getState();
    if (i === O.LOADED || i === O.ERROR || i === O.EMPTY) {
      i !== O.ERROR && e.removeEventListener(z.CHANGE, this.boundHandleTileChange_);
      const s = e.getKey();
      s in this.tilesLoadingKeys_ && (delete this.tilesLoadingKeys_[s], --this.tilesLoading_), this.tileChangeCallback_();
    }
  }
  /**
   * @param {number} maxTotalLoading Maximum number tiles to load simultaneously.
   * @param {number} maxNewLoads Maximum number of new tiles to load.
   */
  loadMoreTiles(t, e) {
    let i = 0;
    for (; this.tilesLoading_ < t && i < e && this.getCount() > 0; ) {
      const s = this.dequeue()[0], r = s.getKey();
      s.getState() === O.IDLE && !(r in this.tilesLoadingKeys_) && (this.tilesLoadingKeys_[r] = !0, ++this.tilesLoading_, ++i, s.load());
    }
  }
}
function ih(n, t, e, i, s) {
  if (!n || !(e in n.wantedTiles) || !n.wantedTiles[e][t.getKey()])
    return Wn;
  const r = n.viewState.center, o = i[0] - r[0], a = i[1] - r[1];
  return 65536 * Math.log(s) + Math.sqrt(o * o + a * a) / s;
}
const Et = {
  ANIMATING: 0,
  INTERACTING: 1
}, Bt = {
  CENTER: "center",
  RESOLUTION: "resolution",
  ROTATION: "rotation"
};
function it(n, t, e) {
  return Math.min(Math.max(n, t), e);
}
function nh(n, t, e, i, s, r) {
  const o = s - e, a = r - i;
  if (o !== 0 || a !== 0) {
    const l = ((n - e) * o + (t - i) * a) / (o * o + a * a);
    l > 1 ? (e = s, i = r) : l > 0 && (e += o * l, i += a * l);
  }
  return pi(n, t, e, i);
}
function pi(n, t, e, i) {
  const s = e - n, r = i - t;
  return s * s + r * r;
}
function sh(n) {
  const t = n.length;
  for (let i = 0; i < t; i++) {
    let s = i, r = Math.abs(n[i][i]);
    for (let a = i + 1; a < t; a++) {
      const l = Math.abs(n[a][i]);
      l > r && (r = l, s = a);
    }
    if (r === 0)
      return null;
    const o = n[s];
    n[s] = n[i], n[i] = o;
    for (let a = i + 1; a < t; a++) {
      const l = -n[a][i] / n[i][i];
      for (let c = i; c < t + 1; c++)
        i == c ? n[a][c] = 0 : n[a][c] += l * n[i][c];
    }
  }
  const e = new Array(t);
  for (let i = t - 1; i >= 0; i--) {
    e[i] = n[i][t] / n[i][i];
    for (let s = i - 1; s >= 0; s--)
      n[s][t] -= n[s][i] * e[i];
  }
  return e;
}
function oo(n) {
  return n * 180 / Math.PI;
}
function Ae(n) {
  return n * Math.PI / 180;
}
function Be(n, t) {
  const e = n % t;
  return e * t < 0 ? e + t : e;
}
function Nt(n, t, e) {
  return n + e * (t - n);
}
function is(n, t) {
  const e = Math.pow(10, t);
  return Math.round(n * e) / e;
}
function Rn(n, t) {
  return Math.floor(is(n, t));
}
function Sn(n, t) {
  return Math.ceil(is(n, t));
}
function tr(n, t, e) {
  if (n >= t && n < e)
    return n;
  const i = e - t;
  return ((n - t) % i + i) % i + t;
}
function ao(n, t, e) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate|undefined} center Center.
     * @param {number|undefined} resolution Resolution.
     * @param {import("./size.js").Size} size Viewport size; unused if `onlyCenter` was specified.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @param {Array<number>} [centerShift] Shift between map center and viewport center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    function(i, s, r, o, a) {
      if (!i)
        return;
      if (!s && !t)
        return i;
      const l = t ? 0 : r[0] * s, c = t ? 0 : r[1] * s, h = a ? a[0] : 0, u = a ? a[1] : 0;
      let d = n[0] + l / 2 + h, f = n[2] - l / 2 + h, g = n[1] + c / 2 + u, m = n[3] - c / 2 + u;
      d > f && (d = (f + d) / 2, f = d), g > m && (g = (m + g) / 2, m = g);
      let _ = it(i[0], d, f), p = it(i[1], g, m);
      if (o && e && s) {
        const E = 30 * s;
        _ += -E * Math.log(1 + Math.max(0, d - i[0]) / E) + E * Math.log(1 + Math.max(0, i[0] - f) / E), p += -E * Math.log(1 + Math.max(0, g - i[1]) / E) + E * Math.log(1 + Math.max(0, i[1] - m) / E);
      }
      return [_, p];
    }
  );
}
function rh(n) {
  return n;
}
const ut = {
  UNKNOWN: 0,
  INTERSECTING: 1,
  ABOVE: 2,
  RIGHT: 4,
  BELOW: 8,
  LEFT: 16
};
function lo(n) {
  const t = Yt();
  for (let e = 0, i = n.length; e < i; ++e)
    ji(t, n[e]);
  return t;
}
function mr(n, t, e) {
  return e ? (e[0] = n[0] - t, e[1] = n[1] - t, e[2] = n[2] + t, e[3] = n[3] + t, e) : [
    n[0] - t,
    n[1] - t,
    n[2] + t,
    n[3] + t
  ];
}
function ya(n, t) {
  return t ? (t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t) : n.slice();
}
function Ea(n, t, e) {
  let i, s;
  return t < n[0] ? i = n[0] - t : n[2] < t ? i = t - n[2] : i = 0, e < n[1] ? s = n[1] - e : n[3] < e ? s = e - n[3] : s = 0, i * i + s * s;
}
function Ri(n, t) {
  return xa(n, t[0], t[1]);
}
function fi(n, t) {
  return n[0] <= t[0] && t[2] <= n[2] && n[1] <= t[1] && t[3] <= n[3];
}
function xa(n, t, e) {
  return n[0] <= t && t <= n[2] && n[1] <= e && e <= n[3];
}
function er(n, t) {
  const e = n[0], i = n[1], s = n[2], r = n[3], o = t[0], a = t[1];
  let l = ut.UNKNOWN;
  return o < e ? l = l | ut.LEFT : o > s && (l = l | ut.RIGHT), a < i ? l = l | ut.BELOW : a > r && (l = l | ut.ABOVE), l === ut.UNKNOWN && (l = ut.INTERSECTING), l;
}
function Yt() {
  return [1 / 0, 1 / 0, -1 / 0, -1 / 0];
}
function be(n, t, e, i, s) {
  return s ? (s[0] = n, s[1] = t, s[2] = e, s[3] = i, s) : [n, t, e, i];
}
function ns(n) {
  return be(1 / 0, 1 / 0, -1 / 0, -1 / 0, n);
}
function wa(n, t) {
  const e = n[0], i = n[1];
  return be(e, i, e, i, t);
}
function pr(n, t, e, i, s) {
  const r = ns(s);
  return Ca(r, n, t, e, i);
}
function tn(n, t) {
  return n[0] == t[0] && n[2] == t[2] && n[1] == t[1] && n[3] == t[3];
}
function oh(n, t) {
  return t[0] < n[0] && (n[0] = t[0]), t[2] > n[2] && (n[2] = t[2]), t[1] < n[1] && (n[1] = t[1]), t[3] > n[3] && (n[3] = t[3]), n;
}
function ji(n, t) {
  t[0] < n[0] && (n[0] = t[0]), t[0] > n[2] && (n[2] = t[0]), t[1] < n[1] && (n[1] = t[1]), t[1] > n[3] && (n[3] = t[1]);
}
function Ca(n, t, e, i, s) {
  for (; e < i; e += s)
    ah(n, t[e], t[e + 1]);
  return n;
}
function ah(n, t, e) {
  n[0] = Math.min(n[0], t), n[1] = Math.min(n[1], e), n[2] = Math.max(n[2], t), n[3] = Math.max(n[3], e);
}
function Ra(n, t) {
  let e;
  return e = t(ss(n)), e || (e = t(rs(n)), e) || (e = t(os(n)), e) || (e = t($e(n)), e) ? e : !1;
}
function ir(n) {
  let t = 0;
  return as(n) || (t = J(n) * Rt(n)), t;
}
function ss(n) {
  return [n[0], n[1]];
}
function rs(n) {
  return [n[2], n[1]];
}
function je(n) {
  return [(n[0] + n[2]) / 2, (n[1] + n[3]) / 2];
}
function lh(n, t) {
  let e;
  if (t === "bottom-left")
    e = ss(n);
  else if (t === "bottom-right")
    e = rs(n);
  else if (t === "top-left")
    e = $e(n);
  else if (t === "top-right")
    e = os(n);
  else
    throw new Error("Invalid corner");
  return e;
}
function nr(n, t, e, i, s) {
  const [r, o, a, l, c, h, u, d] = Sa(
    n,
    t,
    e,
    i
  );
  return be(
    Math.min(r, a, c, u),
    Math.min(o, l, h, d),
    Math.max(r, a, c, u),
    Math.max(o, l, h, d),
    s
  );
}
function Sa(n, t, e, i) {
  const s = t * i[0] / 2, r = t * i[1] / 2, o = Math.cos(e), a = Math.sin(e), l = s * o, c = s * a, h = r * o, u = r * a, d = n[0], f = n[1];
  return [
    d - l + u,
    f - c - h,
    d - l - u,
    f - c + h,
    d + l - u,
    f + c + h,
    d + l + u,
    f + c - h,
    d - l + u,
    f - c - h
  ];
}
function Rt(n) {
  return n[3] - n[1];
}
function Ve(n, t, e) {
  const i = e || Yt();
  return It(n, t) ? (n[0] > t[0] ? i[0] = n[0] : i[0] = t[0], n[1] > t[1] ? i[1] = n[1] : i[1] = t[1], n[2] < t[2] ? i[2] = n[2] : i[2] = t[2], n[3] < t[3] ? i[3] = n[3] : i[3] = t[3]) : ns(i), i;
}
function $e(n) {
  return [n[0], n[3]];
}
function os(n) {
  return [n[2], n[3]];
}
function J(n) {
  return n[2] - n[0];
}
function It(n, t) {
  return n[0] <= t[2] && n[2] >= t[0] && n[1] <= t[3] && n[3] >= t[1];
}
function as(n) {
  return n[2] < n[0] || n[3] < n[1];
}
function hh(n, t) {
  return t ? (t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t) : n;
}
function ch(n, t, e) {
  let i = !1;
  const s = er(n, t), r = er(n, e);
  if (s === ut.INTERSECTING || r === ut.INTERSECTING)
    i = !0;
  else {
    const o = n[0], a = n[1], l = n[2], c = n[3], h = t[0], u = t[1], d = e[0], f = e[1], g = (f - u) / (d - h);
    let m, _;
    r & ut.ABOVE && !(s & ut.ABOVE) && (m = d - (f - c) / g, i = m >= o && m <= l), !i && r & ut.RIGHT && !(s & ut.RIGHT) && (_ = f - (d - l) * g, i = _ >= a && _ <= c), !i && r & ut.BELOW && !(s & ut.BELOW) && (m = d - (f - a) / g, i = m >= o && m <= l), !i && r & ut.LEFT && !(s & ut.LEFT) && (_ = f - (d - o) * g, i = _ >= a && _ <= c);
  }
  return i;
}
function Ta(n, t) {
  const e = t.getExtent(), i = je(n);
  if (t.canWrapX() && (i[0] < e[0] || i[0] >= e[2])) {
    const s = J(e), o = Math.floor(
      (i[0] - e[0]) / s
    ) * s;
    n[0] -= o, n[2] -= o;
  }
  return n;
}
function Ia(n, t, e) {
  if (t.canWrapX()) {
    const i = t.getExtent();
    if (!isFinite(n[0]) || !isFinite(n[2]))
      return [[i[0], n[1], i[2], n[3]]];
    Ta(n, t);
    const s = J(i);
    if (J(n) > s && !e)
      return [[i[0], n[1], i[2], n[3]]];
    if (n[0] < i[0])
      return [
        [n[0] + s, n[1], i[2], n[3]],
        [i[0], n[1], n[2], n[3]]
      ];
    if (n[2] > i[2])
      return [
        [n[0], n[1], i[2], n[3]],
        [i[0], n[1], n[2] - s, n[3]]
      ];
  }
  return [n];
}
function uh(n, t) {
  return n[0] += +t[0], n[1] += +t[1], n;
}
function Xn(n, t) {
  let e = !0;
  for (let i = n.length - 1; i >= 0; --i)
    if (n[i] != t[i]) {
      e = !1;
      break;
    }
  return e;
}
function yr(n, t) {
  const e = Math.cos(t), i = Math.sin(t), s = n[0] * e - n[1] * i, r = n[1] * e + n[0] * i;
  return n[0] = s, n[1] = r, n;
}
function dh(n, t) {
  return n[0] *= t, n[1] *= t, n;
}
function va(n, t) {
  if (t.canWrapX()) {
    const e = J(t.getExtent()), i = fh(n, t, e);
    i && (n[0] -= i * e);
  }
  return n;
}
function fh(n, t, e) {
  const i = t.getExtent();
  let s = 0;
  return t.canWrapX() && (n[0] < i[0] || n[0] > i[2]) && (e = e || J(i), s = Math.floor(
    (n[0] - i[0]) / e
  )), s;
}
function La(n) {
  return Math.pow(n, 3);
}
function Ai(n) {
  return 1 - La(1 - n);
}
function gh(n) {
  return 3 * n * n - 2 * n * n * n;
}
function _h(n) {
  return n;
}
const mh = 63710088e-1;
function ho(n, t, e) {
  e = e || mh;
  const i = Ae(n[1]), s = Ae(t[1]), r = (s - i) / 2, o = Ae(t[0] - n[0]) / 2, a = Math.sin(r) * Math.sin(r) + Math.sin(o) * Math.sin(o) * Math.cos(i) * Math.cos(s);
  return 2 * e * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function Aa(...n) {
  console.warn(...n);
}
const Er = {
  // use the radius of the Normal sphere
  radians: 6370997 / (2 * Math.PI),
  degrees: 2 * Math.PI * 6370997 / 360,
  ft: 0.3048,
  m: 1,
  "us-ft": 1200 / 3937
};
class xr {
  /**
   * @param {Options} options Projection options.
   */
  constructor(t) {
    this.code_ = t.code, this.units_ = /** @type {import("./Units.js").Units} */
    t.units, this.extent_ = t.extent !== void 0 ? t.extent : null, this.worldExtent_ = t.worldExtent !== void 0 ? t.worldExtent : null, this.axisOrientation_ = t.axisOrientation !== void 0 ? t.axisOrientation : "enu", this.global_ = t.global !== void 0 ? t.global : !1, this.canWrapX_ = !!(this.global_ && this.extent_), this.getPointResolutionFunc_ = t.getPointResolution, this.defaultTileGrid_ = null, this.metersPerUnit_ = t.metersPerUnit;
  }
  /**
   * @return {boolean} The projection is suitable for wrapping the x-axis
   */
  canWrapX() {
    return this.canWrapX_;
  }
  /**
   * Get the code for this projection, e.g. 'EPSG:4326'.
   * @return {string} Code.
   * @api
   */
  getCode() {
    return this.code_;
  }
  /**
   * Get the validity extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the units of this projection.
   * @return {import("./Units.js").Units} Units.
   * @api
   */
  getUnits() {
    return this.units_;
  }
  /**
   * Get the amount of meters per unit of this projection.  If the projection is
   * not configured with `metersPerUnit` or a units identifier, the return is
   * `undefined`.
   * @return {number|undefined} Meters.
   * @api
   */
  getMetersPerUnit() {
    return this.metersPerUnit_ || Er[this.units_];
  }
  /**
   * Get the world extent for this projection.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getWorldExtent() {
    return this.worldExtent_;
  }
  /**
   * Get the axis orientation of this projection.
   * Example values are:
   * enu - the default easting, northing, elevation.
   * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
   *     or south orientated transverse mercator.
   * wnu - westing, northing, up - some planetary coordinate systems have
   *     "west positive" coordinate systems
   * @return {string} Axis orientation.
   * @api
   */
  getAxisOrientation() {
    return this.axisOrientation_;
  }
  /**
   * Is this projection a global projection which spans the whole world?
   * @return {boolean} Whether the projection is global.
   * @api
   */
  isGlobal() {
    return this.global_;
  }
  /**
   * Set if the projection is a global projection which spans the whole world
   * @param {boolean} global Whether the projection is global.
   * @api
   */
  setGlobal(t) {
    this.global_ = t, this.canWrapX_ = !!(t && this.extent_);
  }
  /**
   * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
   */
  getDefaultTileGrid() {
    return this.defaultTileGrid_;
  }
  /**
   * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
   */
  setDefaultTileGrid(t) {
    this.defaultTileGrid_ = t;
  }
  /**
   * Set the validity extent for this projection.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  setExtent(t) {
    this.extent_ = t, this.canWrapX_ = !!(this.global_ && t);
  }
  /**
   * Set the world extent for this projection.
   * @param {import("../extent.js").Extent} worldExtent World extent
   *     [minlon, minlat, maxlon, maxlat].
   * @api
   */
  setWorldExtent(t) {
    this.worldExtent_ = t;
  }
  /**
   * Set the getPointResolution function (see {@link module:ol/proj.getPointResolution}
   * for this projection.
   * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
   * @api
   */
  setGetPointResolution(t) {
    this.getPointResolutionFunc_ = t;
  }
  /**
   * Get the custom point resolution function for this projection (if set).
   * @return {GetPointResolution|undefined} The custom point
   * resolution function (if set).
   */
  getPointResolutionFunc() {
    return this.getPointResolutionFunc_;
  }
}
const _n = 6378137, gi = Math.PI * _n, ph = [-gi, -gi, gi, gi], yh = [-180, -85, 180, 85], Tn = _n * Math.log(Math.tan(Math.PI / 2));
class ii extends xr {
  /**
   * @param {string} code Code.
   */
  constructor(t) {
    super({
      code: t,
      units: "m",
      extent: ph,
      global: !0,
      worldExtent: yh,
      getPointResolution: function(e, i) {
        return e / Math.cosh(i[1] / _n);
      }
    });
  }
}
const co = [
  new ii("EPSG:3857"),
  new ii("EPSG:102100"),
  new ii("EPSG:102113"),
  new ii("EPSG:900913"),
  new ii("http://www.opengis.net/def/crs/EPSG/0/3857"),
  new ii("http://www.opengis.net/gml/srs/epsg.xml#3857")
];
function Eh(n, t, e, i) {
  const s = n.length;
  e = e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = n.slice() : t = new Array(s));
  for (let r = 0; r < s; r += i) {
    t[r] = gi * n[r] / 180;
    let o = _n * Math.log(Math.tan(Math.PI * (+n[r + 1] + 90) / 360));
    o > Tn ? o = Tn : o < -Tn && (o = -Tn), t[r + 1] = o;
  }
  return t;
}
function xh(n, t, e, i) {
  const s = n.length;
  e = e > 1 ? e : 2, i = i ?? e, t === void 0 && (e > 2 ? t = n.slice() : t = new Array(s));
  for (let r = 0; r < s; r += i)
    t[r] = 180 * n[r] / gi, t[r + 1] = 360 * Math.atan(Math.exp(n[r + 1] / _n)) / Math.PI - 90;
  return t;
}
const wh = 6378137, uo = [-180, -90, 180, 90], Ch = Math.PI * wh / 180;
class ke extends xr {
  /**
   * @param {string} code Code.
   * @param {string} [axisOrientation] Axis orientation.
   */
  constructor(t, e) {
    super({
      code: t,
      units: "degrees",
      extent: uo,
      axisOrientation: e,
      global: !0,
      metersPerUnit: Ch,
      worldExtent: uo
    });
  }
}
const fo = [
  new ke("CRS:84"),
  new ke("EPSG:4326", "neu"),
  new ke("urn:ogc:def:crs:OGC:1.3:CRS84"),
  new ke("urn:ogc:def:crs:OGC:2:84"),
  new ke("http://www.opengis.net/def/crs/OGC/1.3/CRS84"),
  new ke("http://www.opengis.net/gml/srs/epsg.xml#4326", "neu"),
  new ke("http://www.opengis.net/def/crs/EPSG/0/4326", "neu")
];
let sr = {};
function Rh(n) {
  return sr[n] || sr[n.replace(/urn:(x-)?ogc:def:crs:EPSG:(.*:)?(\w+)$/, "EPSG:$3")] || null;
}
function Sh(n, t) {
  sr[n] = t;
}
let yi = {};
function en(n, t, e) {
  const i = n.getCode(), s = t.getCode();
  i in yi || (yi[i] = {}), yi[i][s] = e;
}
function Ts(n, t) {
  return n in yi && t in yi[n] ? yi[n][t] : null;
}
const Yn = 0.9996, Xt = 669438e-8, ls = Xt * Xt, hs = ls * Xt, We = Xt / (1 - Xt), go = Math.sqrt(1 - Xt), Si = (1 - go) / (1 + go), Ma = Si * Si, wr = Ma * Si, Cr = wr * Si, ba = Cr * Si, Pa = 1 - Xt / 4 - 3 * ls / 64 - 5 * hs / 256, Th = 3 * Xt / 8 + 3 * ls / 32 + 45 * hs / 1024, Ih = 15 * ls / 256 + 45 * hs / 1024, vh = 35 * hs / 3072, Lh = 3 / 2 * Si - 27 / 32 * wr + 269 / 512 * ba, Ah = 21 / 16 * Ma - 55 / 32 * Cr, Mh = 151 / 96 * wr - 417 / 128 * ba, bh = 1097 / 512 * Cr, Kn = 6378137;
function Ph(n, t, e) {
  const i = n - 5e5, o = (e.north ? t : t - 1e7) / Yn / (Kn * Pa), a = o + Lh * Math.sin(2 * o) + Ah * Math.sin(4 * o) + Mh * Math.sin(6 * o) + bh * Math.sin(8 * o), l = Math.sin(a), c = l * l, h = Math.cos(a), u = l / h, d = u * u, f = d * d, g = 1 - Xt * c, m = Math.sqrt(1 - Xt * c), _ = Kn / m, p = (1 - Xt) / g, E = We * h ** 2, w = E * E, y = i / (_ * Yn), x = y * y, R = x * y, T = R * y, S = T * y, v = S * y, L = a - u / p * (x / 2 - T / 24 * (5 + 3 * d + 10 * E - 4 * w - 9 * We)) + v / 720 * (61 + 90 * d + 298 * E + 45 * f - 252 * We - 3 * w);
  let k = (y - R / 6 * (1 + 2 * d + E) + S / 120 * (5 - 2 * E + 28 * d - 3 * w + 8 * We + 24 * f)) / h;
  return k = tr(
    k + Ae(Oa(e.number)),
    -Math.PI,
    Math.PI
  ), [oo(k), oo(L)];
}
const _o = -80, mo = 84, Oh = -180, Dh = 180;
function Fh(n, t, e) {
  n = tr(n, Oh, Dh), t < _o ? t = _o : t > mo && (t = mo);
  const i = Ae(t), s = Math.sin(i), r = Math.cos(i), o = s / r, a = o * o, l = a * a, c = Ae(n), h = Oa(e.number), u = Ae(h), d = Kn / Math.sqrt(1 - Xt * s ** 2), f = We * r ** 2, g = r * tr(c - u, -Math.PI, Math.PI), m = g * g, _ = m * g, p = _ * g, E = p * g, w = E * g, y = Kn * (Pa * i - Th * Math.sin(2 * i) + Ih * Math.sin(4 * i) - vh * Math.sin(6 * i)), x = Yn * d * (g + _ / 6 * (1 - a + f) + E / 120 * (5 - 18 * a + l + 72 * f - 58 * We)) + 5e5;
  let R = Yn * (y + d * o * (m / 2 + p / 24 * (5 - a + 9 * f + 4 * f ** 2) + w / 720 * (61 - 58 * a + l + 600 * f - 330 * We)));
  return e.north || (R += 1e7), [x, R];
}
function Oa(n) {
  return (n - 1) * 6 - 180 + 3;
}
const kh = [
  /^EPSG:(\d+)$/,
  /^urn:ogc:def:crs:EPSG::(\d+)$/,
  /^http:\/\/www\.opengis\.net\/def\/crs\/EPSG\/0\/(\d+)$/
];
function Da(n) {
  let t = 0;
  for (const s of kh) {
    const r = n.match(s);
    if (r) {
      t = parseInt(r[1]);
      break;
    }
  }
  if (!t)
    return null;
  let e = 0, i = !1;
  return t > 32700 && t < 32761 ? e = t - 32700 : t > 32600 && t < 32661 && (i = !0, e = t - 32600), e ? { number: e, north: i } : null;
}
function po(n, t) {
  return function(e, i, s, r) {
    const o = e.length;
    s = s > 1 ? s : 2, r = r ?? s, i || (s > 2 ? i = e.slice() : i = new Array(o));
    for (let a = 0; a < o; a += r) {
      const l = e[a], c = e[a + 1], h = n(l, c, t);
      i[a] = h[0], i[a + 1] = h[1];
    }
    return i;
  };
}
function Nh(n) {
  return Da(n) ? new xr({ code: n, units: "m" }) : null;
}
function Gh(n) {
  const t = Da(n.getCode());
  return t ? {
    forward: po(Fh, t),
    inverse: po(Ph, t)
  } : null;
}
const zh = [Gh], Wh = [Nh];
let rr = !0;
function Fa(n) {
  rr = !1;
}
function Rr(n, t) {
  if (t !== void 0) {
    for (let e = 0, i = n.length; e < i; ++e)
      t[e] = n[e];
    t = t;
  } else
    t = n.slice();
  return t;
}
function or(n) {
  Sh(n.getCode(), n), en(n, n, Rr);
}
function Xh(n) {
  n.forEach(or);
}
function At(n) {
  if (typeof n != "string")
    return n;
  const t = Rh(n);
  if (t)
    return t;
  for (const e of Wh) {
    const i = e(n);
    if (i)
      return i;
  }
  return null;
}
function yo(n, t, e, i) {
  n = At(n);
  let s;
  const r = n.getPointResolutionFunc();
  if (r)
    s = r(t, e);
  else {
    const o = n.getUnits();
    if (o == "degrees" || i == "degrees")
      s = t;
    else {
      const a = Ir(
        n,
        At("EPSG:4326")
      );
      if (!a && o !== "degrees")
        s = t * n.getMetersPerUnit();
      else {
        let c = [
          e[0] - t / 2,
          e[1],
          e[0] + t / 2,
          e[1],
          e[0],
          e[1] - t / 2,
          e[0],
          e[1] + t / 2
        ];
        c = a(c, c, 2);
        const h = ho(c.slice(0, 2), c.slice(2, 4)), u = ho(c.slice(4, 6), c.slice(6, 8));
        s = (h + u) / 2;
      }
      const l = n.getMetersPerUnit();
      l !== void 0 && (s /= l);
    }
  }
  return s;
}
function Eo(n) {
  Xh(n), n.forEach(function(t) {
    n.forEach(function(e) {
      t !== e && en(t, e, Rr);
    });
  });
}
function Yh(n, t, e, i) {
  n.forEach(function(s) {
    t.forEach(function(r) {
      en(s, r, e), en(r, s, i);
    });
  });
}
function Sr(n, t) {
  return n ? typeof n == "string" ? At(n) : (
    /** @type {Projection} */
    n
  ) : At(t);
}
function Kh(n) {
  return (
    /**
     * @param {Array<number>} input Input.
     * @param {Array<number>} [output] Output.
     * @param {number} [dimension] Dimensions that should be transformed.
     * @param {number} [stride] Stride.
     * @return {Array<number>} Output.
     */
    function(t, e, i, s) {
      const r = t.length;
      i = i !== void 0 ? i : 2, s = s ?? i, e = e !== void 0 ? e : new Array(r);
      for (let o = 0; o < r; o += s) {
        const a = n(t.slice(o, o + i)), l = a.length;
        for (let c = 0, h = s; c < h; ++c)
          e[o + c] = c >= l ? t[o + c] : a[c];
      }
      return e;
    }
  );
}
function Tr(n, t) {
  return Fa(), cs(
    n,
    "EPSG:4326",
    "EPSG:3857"
  );
}
function ka(n, t) {
  const e = cs(
    n,
    "EPSG:3857",
    "EPSG:4326"
  ), i = e[0];
  return (i < -180 || i > 180) && (e[0] = Be(i + 180, 360) - 180), e;
}
function Is(n, t) {
  if (n === t)
    return !0;
  const e = n.getUnits() === t.getUnits();
  return (n.getCode() === t.getCode() || Ir(n, t) === Rr) && e;
}
function Ir(n, t) {
  const e = n.getCode(), i = t.getCode();
  let s = Ts(e, i);
  if (s)
    return s;
  let r = null, o = null;
  for (const l of zh)
    r || (r = l(n)), o || (o = l(t));
  if (!r && !o)
    return null;
  const a = "EPSG:4326";
  if (o)
    if (r)
      s = vs(
        r.inverse,
        o.forward
      );
    else {
      const l = Ts(e, a);
      l && (s = vs(
        l,
        o.forward
      ));
    }
  else {
    const l = Ts(a, i);
    l && (s = vs(
      r.inverse,
      l
    ));
  }
  return s && (or(n), or(t), en(n, t, s)), s;
}
function vs(n, t) {
  return function(e, i, s, r) {
    return i = n(e, i, s, r), t(i, i, s, r);
  };
}
function Bn(n, t) {
  const e = At(n), i = At(t);
  return Ir(e, i);
}
function cs(n, t, e) {
  const i = Bn(t, e);
  if (!i) {
    const s = At(t).getCode(), r = At(e).getCode();
    throw new Error(
      `No transform available between ${s} and ${r}`
    );
  }
  return i(n, void 0, n.length);
}
function ar(n, t) {
  return n;
}
function ce(n, t) {
  return rr && !Xn(n, [0, 0]) && n[0] >= -180 && n[0] <= 180 && n[1] >= -90 && n[1] <= 90 && (rr = !1, Aa(
    "Call useGeographic() from ol/proj once to work with [longitude, latitude] coordinates."
  )), n;
}
function Na(n, t) {
  return n;
}
function ve(n, t) {
  return n;
}
function Bh() {
  Eo(co), Eo(fo), Yh(
    fo,
    co,
    Eh,
    xh
  );
}
Bh();
new Array(6);
function jt() {
  return [1, 0, 0, 1, 0, 0];
}
function Vh(n, t) {
  return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n[4] = t[4], n[5] = t[5], n;
}
function dt(n, t) {
  const e = t[0], i = t[1];
  return t[0] = n[0] * e + n[2] * i + n[4], t[1] = n[1] * e + n[3] * i + n[5], t;
}
function pe(n, t, e, i, s, r, o, a) {
  const l = Math.sin(r), c = Math.cos(r);
  return n[0] = i * c, n[1] = s * l, n[2] = -i * l, n[3] = s * c, n[4] = o * i * c - a * i * l + t, n[5] = o * s * l + a * s * c + e, n;
}
function Ga(n, t) {
  const e = Zh(t);
  $(e !== 0, "Transformation matrix cannot be inverted");
  const i = t[0], s = t[1], r = t[2], o = t[3], a = t[4], l = t[5];
  return n[0] = o / e, n[1] = -s / e, n[2] = -r / e, n[3] = i / e, n[4] = (r * l - o * a) / e, n[5] = -(i * l - s * a) / e, n;
}
function Zh(n) {
  return n[0] * n[3] - n[1] * n[2];
}
const Uh = [1e5, 1e5, 1e5, 1e5, 2, 2];
function jh(n) {
  return "matrix(" + n.join(", ") + ")";
}
function xo(n) {
  return n.substring(7, n.length - 1).split(",").map(parseFloat);
}
function Hh(n, t) {
  const e = xo(n), i = xo(t);
  for (let s = 0; s < 6; ++s)
    if (Math.round((e[s] - i[s]) * Uh[s]) !== 0)
      return !1;
  return !0;
}
function Me(n, t, e, i, s, r, o) {
  r = r || [], o = o || 2;
  let a = 0;
  for (let l = t; l < e; l += i) {
    const c = n[l], h = n[l + 1];
    r[a++] = s[0] * c + s[2] * h + s[4], r[a++] = s[1] * c + s[3] * h + s[5];
    for (let u = 2; u < o; u++)
      r[a++] = n[l + u];
  }
  return r && r.length != a && (r.length = a), r;
}
function za(n, t, e, i, s, r, o) {
  o = o || [];
  const a = Math.cos(s), l = Math.sin(s), c = r[0], h = r[1];
  let u = 0;
  for (let d = t; d < e; d += i) {
    const f = n[d] - c, g = n[d + 1] - h;
    o[u++] = c + f * a - g * l, o[u++] = h + f * l + g * a;
    for (let m = d + 2; m < d + i; ++m)
      o[u++] = n[m];
  }
  return o && o.length != u && (o.length = u), o;
}
function $h(n, t, e, i, s, r, o, a) {
  a = a || [];
  const l = o[0], c = o[1];
  let h = 0;
  for (let u = t; u < e; u += i) {
    const d = n[u] - l, f = n[u + 1] - c;
    a[h++] = l + s * d, a[h++] = c + r * f;
    for (let g = u + 2; g < u + i; ++g)
      a[h++] = n[g];
  }
  return a && a.length != h && (a.length = h), a;
}
function qh(n, t, e, i, s, r, o) {
  o = o || [];
  let a = 0;
  for (let l = t; l < e; l += i) {
    o[a++] = n[l] + s, o[a++] = n[l + 1] + r;
    for (let c = l + 2; c < l + i; ++c)
      o[a++] = n[c];
  }
  return o && o.length != a && (o.length = a), o;
}
const wo = jt(), Jh = [NaN, NaN];
class Qh extends $t {
  constructor() {
    super(), this.extent_ = Yt(), this.extentRevision_ = -1, this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = 0, this.simplifyTransformedInternal = fa(
      (t, e, i) => {
        if (!i)
          return this.getSimplifiedGeometry(e);
        const s = this.clone();
        return s.applyTransform(i), s.getSimplifiedGeometry(e);
      }
    );
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {Geometry} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this.simplifyTransformedInternal(
      this.getRevision(),
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  clone() {
    return j();
  }
  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  closestPointXY(t, e, i, s) {
    return j();
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  containsXY(t, e) {
    return this.closestPointXY(t, e, Jh, Number.MIN_VALUE) === 0;
  }
  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate} [closestPoint] Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  getClosestPoint(t, e) {
    return e = e || [NaN, NaN], this.closestPointXY(t[0], t[1], e, 1 / 0), e;
  }
  /**
   * Returns true if this geometry includes the specified coordinate. If the
   * coordinate is on the boundary of the geometry, returns false.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {boolean} Contains coordinate.
   * @api
   */
  intersectsCoordinate(t) {
    return this.containsXY(t[0], t[1]);
  }
  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  computeExtent(t) {
    return j();
  }
  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  getExtent(t) {
    if (this.extentRevision_ != this.getRevision()) {
      const e = this.computeExtent(this.extent_);
      (isNaN(e[0]) || isNaN(e[1])) && ns(e), this.extentRevision_ = this.getRevision();
    }
    return hh(this.extent_, t);
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  rotate(t, e) {
    j();
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  scale(t, e, i) {
    j();
  }
  /**
   * Create a simplified version of this geometry.  For linestrings, this uses
   * the [Douglas Peucker](https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)
   * algorithm.  For polygons, a quantization-based
   * simplification is used to preserve topology.
   * @param {number} tolerance The tolerance distance for simplification.
   * @return {Geometry} A new, simplified version of the original geometry.
   * @api
   */
  simplify(t) {
    return this.getSimplifiedGeometry(t * t);
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker
   * algorithm.
   * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Geometry} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return j();
  }
  /**
   * Get the type of this geometry.
   * @abstract
   * @return {Type} Geometry type.
   */
  getType() {
    return j();
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @abstract
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   */
  applyTransform(t) {
    j();
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  intersectsExtent(t) {
    return j();
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  translate(t, e) {
    j();
  }
  /**
   * Transform each coordinate of the geometry from one coordinate reference
   * system to another. The geometry is modified in place.
   * For example, a line will be transformed to a line and a circle to a circle.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   *
   * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @return {this} This geometry.  Note that original geometry is
   *     modified in place.
   * @api
   */
  transform(t, e) {
    const i = At(t), s = i.getUnits() == "tile-pixels" ? function(r, o, a) {
      const l = i.getExtent(), c = i.getWorldExtent(), h = Rt(c) / Rt(l);
      pe(
        wo,
        c[0],
        c[3],
        h,
        -h,
        0,
        0,
        0
      );
      const u = Me(
        r,
        0,
        r.length,
        a,
        wo,
        o
      ), d = Bn(i, e);
      return d ? d(u, u, a) : u;
    } : Bn(i, e);
    return this.applyTransform(s), this;
  }
}
class vr extends Qh {
  constructor() {
    super(), this.layout = "XY", this.stride = 2, this.flatCoordinates;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return pr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t
    );
  }
  /**
   * @abstract
   * @return {Array<*> | null} Coordinates.
   */
  getCoordinates() {
    return j();
  }
  /**
   * Return the first coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} First coordinate.
   * @api
   */
  getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getFlatCoordinates() {
    return this.flatCoordinates;
  }
  /**
   * Return the last coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} Last point.
   * @api
   */
  getLastCoordinate() {
    return this.flatCoordinates.slice(
      this.flatCoordinates.length - this.stride
    );
  }
  /**
   * Return the {@link import("./Geometry.js").GeometryLayout layout} of the geometry.
   * @return {import("./Geometry.js").GeometryLayout} Layout.
   * @api
   */
  getLayout() {
    return this.layout;
  }
  /**
   * Create a simplified version of this geometry using the Douglas Peucker algorithm.
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @override
   */
  getSimplifiedGeometry(t) {
    if (this.simplifiedGeometryRevision !== this.getRevision() && (this.simplifiedGeometryMaxMinSquaredTolerance = 0, this.simplifiedGeometryRevision = this.getRevision()), t < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && t <= this.simplifiedGeometryMaxMinSquaredTolerance)
      return this;
    const e = this.getSimplifiedGeometryInternal(t);
    return e.getFlatCoordinates().length < this.flatCoordinates.length ? e : (this.simplifiedGeometryMaxMinSquaredTolerance = t, this);
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @protected
   */
  getSimplifiedGeometryInternal(t) {
    return this;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride;
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout} layout Layout.
   * @param {Array<number>} flatCoordinates Flat coordinates.
   */
  setFlatCoordinates(t, e) {
    this.stride = Co(t), this.layout = t, this.flatCoordinates = e;
  }
  /**
   * @abstract
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  setCoordinates(t, e) {
    j();
  }
  /**
   * @param {import("./Geometry.js").GeometryLayout|undefined} layout Layout.
   * @param {Array<*>} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  setLayout(t, e, i) {
    let s;
    if (t)
      s = Co(t);
    else {
      for (let r = 0; r < i; ++r) {
        if (e.length === 0) {
          this.layout = "XY", this.stride = 2;
          return;
        }
        e = /** @type {Array<unknown>} */
        e[0];
      }
      s = e.length, t = tc(s);
    }
    this.layout = t, this.stride = s;
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   * Called with a flat array of geometry coordinates.
   * @api
   * @override
   */
  applyTransform(t) {
    this.flatCoordinates && (t(
      this.flatCoordinates,
      this.flatCoordinates,
      this.layout.startsWith("XYZ") ? 3 : 2,
      this.stride
    ), this.changed());
  }
  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @param {number} angle Rotation angle in counter-clockwise radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   * @override
   */
  rotate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const s = this.getStride();
      za(
        i,
        0,
        i.length,
        s,
        t,
        e,
        i
      ), this.changed();
    }
  }
  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number} [sy] The scaling factor in the y-direction (defaults to sx).
   * @param {import("../coordinate.js").Coordinate} [anchor] The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   * @override
   */
  scale(t, e, i) {
    e === void 0 && (e = t), i || (i = je(this.getExtent()));
    const s = this.getFlatCoordinates();
    if (s) {
      const r = this.getStride();
      $h(
        s,
        0,
        s.length,
        r,
        t,
        e,
        i,
        s
      ), this.changed();
    }
  }
  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   * @override
   */
  translate(t, e) {
    const i = this.getFlatCoordinates();
    if (i) {
      const s = this.getStride();
      qh(
        i,
        0,
        i.length,
        s,
        t,
        e,
        i
      ), this.changed();
    }
  }
}
function tc(n) {
  let t;
  return n == 2 ? t = "XY" : n == 3 ? t = "XYZ" : n == 4 && (t = "XYZM"), /** @type {import("./Geometry.js").GeometryLayout} */
  t;
}
function Co(n) {
  let t;
  return n == "XY" ? t = 2 : n == "XYZ" || n == "XYM" ? t = 3 : n == "XYZM" && (t = 4), /** @type {number} */
  t;
}
function ec(n, t, e) {
  const i = n.getFlatCoordinates();
  if (!i)
    return null;
  const s = n.getStride();
  return Me(
    i,
    0,
    i.length,
    s,
    t,
    e
  );
}
function Wa(n, t, e, i) {
  let s = 0;
  const r = n[e - i], o = n[e - i + 1];
  let a = 0, l = 0;
  for (; t < e; t += i) {
    const c = n[t] - r, h = n[t + 1] - o;
    s += l * c - a * h, a = c, l = h;
  }
  return s / 2;
}
function ic(n, t, e, i) {
  let s = 0;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    s += Wa(n, t, a, i), t = a;
  }
  return s;
}
function Ro(n, t, e, i, s, r, o) {
  const a = n[t], l = n[t + 1], c = n[e] - a, h = n[e + 1] - l;
  let u;
  if (c === 0 && h === 0)
    u = t;
  else {
    const d = ((s - a) * c + (r - l) * h) / (c * c + h * h);
    if (d > 1)
      u = e;
    else if (d > 0) {
      for (let f = 0; f < i; ++f)
        o[f] = Nt(
          n[t + f],
          n[e + f],
          d
        );
      o.length = i;
      return;
    } else
      u = t;
  }
  for (let d = 0; d < i; ++d)
    o[d] = n[u + d];
  o.length = i;
}
function Xa(n, t, e, i, s) {
  let r = n[t], o = n[t + 1];
  for (t += i; t < e; t += i) {
    const a = n[t], l = n[t + 1], c = pi(r, o, a, l);
    c > s && (s = c), r = a, o = l;
  }
  return s;
}
function nc(n, t, e, i, s) {
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r];
    s = Xa(n, t, a, i, s), t = a;
  }
  return s;
}
function Ya(n, t, e, i, s, r, o, a, l, c, h) {
  if (t == e)
    return c;
  let u, d;
  if (s === 0) {
    if (d = pi(
      o,
      a,
      n[t],
      n[t + 1]
    ), d < c) {
      for (u = 0; u < i; ++u)
        l[u] = n[t + u];
      return l.length = i, d;
    }
    return c;
  }
  h = h || [NaN, NaN];
  let f = t + i;
  for (; f < e; )
    if (Ro(
      n,
      f - i,
      f,
      i,
      o,
      a,
      h
    ), d = pi(o, a, h[0], h[1]), d < c) {
      for (c = d, u = 0; u < i; ++u)
        l[u] = h[u];
      l.length = i, f += i;
    } else
      f += i * Math.max(
        (Math.sqrt(d) - Math.sqrt(c)) / s | 0,
        1
      );
  if (Ro(
    n,
    e - i,
    t,
    i,
    o,
    a,
    h
  ), d = pi(o, a, h[0], h[1]), d < c) {
    for (c = d, u = 0; u < i; ++u)
      l[u] = h[u];
    l.length = i;
  }
  return c;
}
function sc(n, t, e, i, s, r, o, a, l, c, h) {
  h = h || [NaN, NaN];
  for (let u = 0, d = e.length; u < d; ++u) {
    const f = e[u];
    c = Ya(
      n,
      t,
      f,
      i,
      s,
      r,
      o,
      a,
      l,
      c,
      h
    ), t = f;
  }
  return c;
}
function rc(n, t, e, i) {
  for (let s = 0, r = e.length; s < r; ++s)
    n[t++] = e[s];
  return t;
}
function Ka(n, t, e, i) {
  for (let s = 0, r = e.length; s < r; ++s) {
    const o = e[s];
    for (let a = 0; a < i; ++a)
      n[t++] = o[a];
  }
  return t;
}
function oc(n, t, e, i, s) {
  s = s || [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = Ka(
      n,
      t,
      e[o],
      i
    );
    s[r++] = l, t = l;
  }
  return s.length = r, s;
}
function _i(n, t, e, i, s) {
  s = s !== void 0 ? s : [];
  let r = 0;
  for (let o = t; o < e; o += i)
    s[r++] = n.slice(o, o + i);
  return s.length = r, s;
}
function Vn(n, t, e, i, s) {
  s = s !== void 0 ? s : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    s[r++] = _i(
      n,
      t,
      l,
      i,
      s[r]
    ), t = l;
  }
  return s.length = r, s;
}
function So(n, t, e, i, s) {
  s = s !== void 0 ? s : [];
  let r = 0;
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    s[r++] = l.length === 1 && l[0] === t ? [] : Vn(
      n,
      t,
      l,
      i,
      s[r]
    ), t = l[l.length - 1];
  }
  return s.length = r, s;
}
function Lr(n, t, e, i, s, r, o) {
  const a = (e - t) / i;
  if (a < 3) {
    for (; t < e; t += i)
      r[o++] = n[t], r[o++] = n[t + 1];
    return o;
  }
  const l = new Array(a);
  l[0] = 1, l[a - 1] = 1;
  const c = [t, e - i];
  let h = 0;
  for (; c.length > 0; ) {
    const u = c.pop(), d = c.pop();
    let f = 0;
    const g = n[d], m = n[d + 1], _ = n[u], p = n[u + 1];
    for (let E = d + i; E < u; E += i) {
      const w = n[E], y = n[E + 1], x = nh(w, y, g, m, _, p);
      x > f && (h = E, f = x);
    }
    f > s && (l[(h - t) / i] = 1, d + i < h && c.push(d, h), h + i < u && c.push(h, u));
  }
  for (let u = 0; u < a; ++u)
    l[u] && (r[o++] = n[t + u * i], r[o++] = n[t + u * i + 1]);
  return o;
}
function ac(n, t, e, i, s, r, o, a) {
  for (let l = 0, c = e.length; l < c; ++l) {
    const h = e[l];
    o = Lr(
      n,
      t,
      h,
      i,
      s,
      r,
      o
    ), a.push(o), t = h;
  }
  return o;
}
function ze(n, t) {
  return t * Math.round(n / t);
}
function lc(n, t, e, i, s, r, o) {
  if (t == e)
    return o;
  let a = ze(n[t], s), l = ze(n[t + 1], s);
  t += i, r[o++] = a, r[o++] = l;
  let c, h;
  do
    if (c = ze(n[t], s), h = ze(n[t + 1], s), t += i, t == e)
      return r[o++] = c, r[o++] = h, o;
  while (c == a && h == l);
  for (; t < e; ) {
    const u = ze(n[t], s), d = ze(n[t + 1], s);
    if (t += i, u == c && d == h)
      continue;
    const f = c - a, g = h - l, m = u - a, _ = d - l;
    if (f * _ == g * m && (f < 0 && m < f || f == m || f > 0 && m > f) && (g < 0 && _ < g || g == _ || g > 0 && _ > g)) {
      c = u, h = d;
      continue;
    }
    r[o++] = c, r[o++] = h, a = c, l = h, c = u, h = d;
  }
  return r[o++] = c, r[o++] = h, o;
}
function Ba(n, t, e, i, s, r, o, a) {
  for (let l = 0, c = e.length; l < c; ++l) {
    const h = e[l];
    o = lc(
      n,
      t,
      h,
      i,
      s,
      r,
      o
    ), a.push(o), t = h;
  }
  return o;
}
class nn extends vr {
  /**
   * @param {Array<import("../coordinate.js").Coordinate>|Array<number>} coordinates Coordinates.
   *     For internal use, flat coordinates in combination with `layout` are also accepted.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, e !== void 0 && !Array.isArray(t[0]) ? this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ) : this.setCoordinates(
      /** @type {Array<import("../coordinate.js").Coordinate>} */
      t,
      e
    );
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @api
   * @override
   */
  clone() {
    return new nn(this.flatCoordinates.slice(), this.layout);
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, s) {
    return s < Ea(this.getExtent(), t, e) ? s : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      Xa(
        this.flatCoordinates,
        0,
        this.flatCoordinates.length,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), Ya(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      s
    ));
  }
  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return Wa(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * Return the coordinates of the linear ring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return _i(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {LinearRing} Simplified LinearRing.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [];
    return e.length = Lr(
      this.flatCoordinates,
      0,
      this.flatCoordinates.length,
      this.stride,
      t,
      e,
      0
    ), new nn(e, "XY");
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "LinearRing";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return !1;
  }
  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 1), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = Ka(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
class us extends vr {
  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   */
  constructor(t, e) {
    super(), this.setCoordinates(t, e);
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new us(this.flatCoordinates.slice(), this.layout);
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, s) {
    const r = this.flatCoordinates, o = pi(
      t,
      e,
      r[0],
      r[1]
    );
    if (o < s) {
      const a = this.stride;
      for (let l = 0; l < a; ++l)
        i[l] = r[l];
      return i.length = a, o;
    }
    return s;
  }
  /**
   * Return the coordinate of the point.
   * @return {import("../coordinate.js").Coordinate} Coordinates.
   * @api
   * @override
   */
  getCoordinates() {
    return this.flatCoordinates.slice();
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   * @override
   */
  computeExtent(t) {
    return wa(this.flatCoordinates, t);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Point";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return xa(t, this.flatCoordinates[0], this.flatCoordinates[1]);
  }
  /**
   * @param {!Array<*>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 0), this.flatCoordinates || (this.flatCoordinates = []), this.flatCoordinates.length = rc(
      this.flatCoordinates,
      0,
      t,
      this.stride
    ), this.changed();
  }
}
function hc(n, t, e, i, s) {
  return !Ra(
    s,
    /**
     * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
     * @return {boolean} Contains (x, y).
     */
    function(o) {
      return !Xe(
        n,
        t,
        e,
        i,
        o[0],
        o[1]
      );
    }
  );
}
function Xe(n, t, e, i, s, r) {
  let o = 0, a = n[e - i], l = n[e - i + 1];
  for (; t < e; t += i) {
    const c = n[t], h = n[t + 1];
    l <= r ? h > r && (c - a) * (r - l) - (s - a) * (h - l) > 0 && o++ : h <= r && (c - a) * (r - l) - (s - a) * (h - l) < 0 && o--, a = c, l = h;
  }
  return o !== 0;
}
function Va(n, t, e, i, s, r) {
  if (e.length === 0 || !Xe(n, t, e[0], i, s, r))
    return !1;
  for (let o = 1, a = e.length; o < a; ++o)
    if (Xe(n, e[o - 1], e[o], i, s, r))
      return !1;
  return !0;
}
function Ar(n, t, e, i, s, r, o) {
  let a, l, c, h, u, d, f;
  const g = s[r + 1], m = [];
  for (let E = 0, w = e.length; E < w; ++E) {
    const y = e[E];
    for (h = n[y - i], d = n[y - i + 1], a = t; a < y; a += i)
      u = n[a], f = n[a + 1], (g <= d && f <= g || d <= g && g <= f) && (c = (g - d) / (f - d) * (u - h) + h, m.push(c)), h = u, d = f;
  }
  let _ = NaN, p = -1 / 0;
  for (m.sort(ge), h = m[0], a = 1, l = m.length; a < l; ++a) {
    u = m[a];
    const E = Math.abs(u - h);
    E > p && (c = (h + u) / 2, Va(n, t, e, i, c, g) && (_ = c, p = E)), h = u;
  }
  return isNaN(_) && (_ = s[r]), o ? (o.push(_, g, p), o) : [_, g, p];
}
function cc(n, t, e, i, s) {
  let r = [];
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    r = Ar(
      n,
      t,
      l,
      i,
      s,
      2 * o,
      r
    ), t = l[l.length - 1];
  }
  return r;
}
function uc(n, t, e, i, s) {
  let r;
  for (t += i; t < e; t += i)
    if (r = s(
      n.slice(t - i, t),
      n.slice(t, t + i)
    ), r)
      return r;
  return !1;
}
function Za(n, t, e, i, s, r) {
  return r = r ?? Ca(Yt(), n, t, e, i), It(s, r) ? r[0] >= s[0] && r[2] <= s[2] || r[1] >= s[1] && r[3] <= s[3] ? !0 : uc(
    n,
    t,
    e,
    i,
    /**
     * @param {import("../../coordinate.js").Coordinate} point1 Start point.
     * @param {import("../../coordinate.js").Coordinate} point2 End point.
     * @return {boolean} `true` if the segment and the extent intersect,
     *     `false` otherwise.
     */
    function(o, a) {
      return ch(s, o, a);
    }
  ) : !1;
}
function Ua(n, t, e, i, s) {
  return !!(Za(n, t, e, i, s) || Xe(
    n,
    t,
    e,
    i,
    s[0],
    s[1]
  ) || Xe(
    n,
    t,
    e,
    i,
    s[0],
    s[3]
  ) || Xe(
    n,
    t,
    e,
    i,
    s[2],
    s[1]
  ) || Xe(
    n,
    t,
    e,
    i,
    s[2],
    s[3]
  ));
}
function dc(n, t, e, i, s) {
  if (!Ua(n, t, e[0], i, s))
    return !1;
  if (e.length === 1)
    return !0;
  for (let r = 1, o = e.length; r < o; ++r)
    if (hc(
      n,
      e[r - 1],
      e[r],
      i,
      s
    ) && !Za(
      n,
      e[r - 1],
      e[r],
      i,
      s
    ))
      return !1;
  return !0;
}
function fc(n, t, e, i) {
  for (; t < e - i; ) {
    for (let s = 0; s < i; ++s) {
      const r = n[t + s];
      n[t + s] = n[e - i + s], n[e - i + s] = r;
    }
    t += i, e -= i;
  }
}
function Mr(n, t, e, i) {
  let s = 0, r = n[e - i], o = n[e - i + 1];
  for (; t < e; t += i) {
    const a = n[t], l = n[t + 1];
    s += (a - r) * (l + o), r = a, o = l;
  }
  return s === 0 ? void 0 : s > 0;
}
function gc(n, t, e, i, s) {
  s = s !== void 0 ? s : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r], l = Mr(
      n,
      t,
      a,
      i
    );
    if (r === 0) {
      if (s && l || !s && !l)
        return !1;
    } else if (s && !l || !s && l)
      return !1;
    t = a;
  }
  return !0;
}
function To(n, t, e, i, s) {
  s = s !== void 0 ? s : !1;
  for (let r = 0, o = e.length; r < o; ++r) {
    const a = e[r], l = Mr(
      n,
      t,
      a,
      i
    );
    (r === 0 ? s && l || !s && !l : s && !l || !s && l) && fc(n, t, a, i), t = a;
  }
  return t;
}
function _c(n, t) {
  const e = [];
  let i = 0, s = 0, r;
  for (let o = 0, a = t.length; o < a; ++o) {
    const l = t[o], c = Mr(n, i, l, 2);
    if (r === void 0 && (r = c), c === r)
      e.push(t.slice(s, o + 1));
    else {
      if (e.length === 0)
        continue;
      e[e.length - 1].push(t[s]);
    }
    s = o + 1, i = l;
  }
  return e;
}
class sn extends vr {
  /**
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>|!Array<number>} coordinates
   *     Array of linear rings that define the polygon. The first linear ring of the
   *     array defines the outer-boundary or surface of the polygon. Each subsequent
   *     linear ring defines a hole in the surface of the polygon. A linear ring is
   *     an array of vertices' coordinates where the first coordinate and the last are
   *     equivalent. (For internal use, flat coordinates in combination with
   *     `layout` and `ends` are also accepted.)
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @param {Array<number>} [ends] Ends (for internal use with flat coordinates).
   */
  constructor(t, e, i) {
    super(), this.ends_ = [], this.flatInteriorPointRevision_ = -1, this.flatInteriorPoint_ = null, this.maxDelta_ = -1, this.maxDeltaRevision_ = -1, this.orientedRevision_ = -1, this.orientedFlatCoordinates_ = null, e !== void 0 && i ? (this.setFlatCoordinates(
      e,
      /** @type {Array<number>} */
      t
    ), this.ends_ = i) : this.setCoordinates(
      /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */
      t,
      e
    );
  }
  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  appendLinearRing(t) {
    this.flatCoordinates ? Ji(this.flatCoordinates, t.getFlatCoordinates()) : this.flatCoordinates = t.getFlatCoordinates().slice(), this.ends_.push(this.flatCoordinates.length), this.changed();
  }
  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @api
   * @override
   */
  clone() {
    const t = new sn(
      this.flatCoordinates.slice(),
      this.layout,
      this.ends_.slice()
    );
    return t.applyProperties(this), t;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   * @override
   */
  closestPointXY(t, e, i, s) {
    return s < Ea(this.getExtent(), t, e) ? s : (this.maxDeltaRevision_ != this.getRevision() && (this.maxDelta_ = Math.sqrt(
      nc(
        this.flatCoordinates,
        0,
        this.ends_,
        this.stride,
        0
      )
    ), this.maxDeltaRevision_ = this.getRevision()), sc(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      this.maxDelta_,
      !0,
      t,
      e,
      i,
      s
    ));
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   * @override
   */
  containsXY(t, e) {
    return Va(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t,
      e
    );
  }
  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  getArea() {
    return ic(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride
    );
  }
  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for polygons.
   *
   * @param {boolean} [right] Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @api
   * @override
   */
  getCoordinates(t) {
    let e;
    return t !== void 0 ? (e = this.getOrientedFlatCoordinates().slice(), To(e, 0, this.ends_, this.stride, t)) : e = this.flatCoordinates, Vn(e, 0, this.ends_, this.stride);
  }
  /**
   * @return {Array<number>} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * @return {Array<number>} Interior point.
   */
  getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      const t = je(this.getExtent());
      this.flatInteriorPoint_ = Ar(
        this.getOrientedFlatCoordinates(),
        0,
        this.ends_,
        this.stride,
        t,
        0
      ), this.flatInteriorPointRevision_ = this.getRevision();
    }
    return (
      /** @type {import("../coordinate.js").Coordinate} */
      this.flatInteriorPoint_
    );
  }
  /**
   * Return an interior point of the polygon.
   * @return {Point} Interior point as XYM coordinate, where M is the
   * length of the horizontal intersection that the point belongs to.
   * @api
   */
  getInteriorPoint() {
    return new us(this.getFlatInteriorPoint(), "XYM");
  }
  /**
   * Return the number of rings of the polygon,  this includes the exterior
   * ring and any interior rings.
   *
   * @return {number} Number of rings.
   * @api
   */
  getLinearRingCount() {
    return this.ends_.length;
  }
  /**
   * Return the Nth linear ring of the polygon geometry. Return `null` if the
   * given index is out of range.
   * The exterior linear ring is available at index `0` and the interior rings
   * at index `1` and beyond.
   *
   * @param {number} index Index.
   * @return {LinearRing|null} Linear ring.
   * @api
   */
  getLinearRing(t) {
    return t < 0 || this.ends_.length <= t ? null : new nn(
      this.flatCoordinates.slice(
        t === 0 ? 0 : this.ends_[t - 1],
        this.ends_[t]
      ),
      this.layout
    );
  }
  /**
   * Return the linear rings of the polygon.
   * @return {Array<LinearRing>} Linear rings.
   * @api
   */
  getLinearRings() {
    const t = this.layout, e = this.flatCoordinates, i = this.ends_, s = [];
    let r = 0;
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o], c = new nn(
        e.slice(r, l),
        t
      );
      s.push(c), r = l;
    }
    return s;
  }
  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      const t = this.flatCoordinates;
      gc(t, 0, this.ends_, this.stride) ? this.orientedFlatCoordinates_ = t : (this.orientedFlatCoordinates_ = t.slice(), this.orientedFlatCoordinates_.length = To(
        this.orientedFlatCoordinates_,
        0,
        this.ends_,
        this.stride
      )), this.orientedRevision_ = this.getRevision();
    }
    return (
      /** @type {Array<number>} */
      this.orientedFlatCoordinates_
    );
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Polygon} Simplified Polygon.
   * @protected
   * @override
   */
  getSimplifiedGeometryInternal(t) {
    const e = [], i = [];
    return e.length = Ba(
      this.flatCoordinates,
      0,
      this.ends_,
      this.stride,
      Math.sqrt(t),
      e,
      0,
      i
    ), new sn(e, "XY", i);
  }
  /**
   * Get the type of this geometry.
   * @return {import("./Geometry.js").Type} Geometry type.
   * @api
   * @override
   */
  getType() {
    return "Polygon";
  }
  /**
   * Test if the geometry and the passed extent intersect.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   * @api
   * @override
   */
  intersectsExtent(t) {
    return dc(
      this.getOrientedFlatCoordinates(),
      0,
      this.ends_,
      this.stride,
      t
    );
  }
  /**
   * Set the coordinates of the polygon.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {import("./Geometry.js").GeometryLayout} [layout] Layout.
   * @api
   * @override
   */
  setCoordinates(t, e) {
    this.setLayout(e, t, 2), this.flatCoordinates || (this.flatCoordinates = []);
    const i = oc(
      this.flatCoordinates,
      0,
      t,
      this.stride,
      this.ends_
    );
    this.flatCoordinates.length = i.length === 0 ? 0 : i[i.length - 1], this.changed();
  }
}
function Io(n) {
  if (as(n))
    throw new Error("Cannot create polygon from empty extent");
  const t = n[0], e = n[1], i = n[2], s = n[3], r = [
    t,
    e,
    t,
    s,
    i,
    s,
    i,
    e,
    t,
    e
  ];
  return new sn(r, "XY", [r.length]);
}
function br(n, t, e, i) {
  const s = J(t) / e[0], r = Rt(t) / e[1];
  return i ? Math.min(n, Math.max(s, r)) : Math.min(n, Math.min(s, r));
}
function Pr(n, t, e) {
  let i = Math.min(n, t);
  const s = 50;
  return i *= Math.log(1 + s * Math.max(0, n / t - 1)) / s + 1, e && (i = Math.max(i, e), i /= Math.log(1 + s * Math.max(0, e / n - 1)) / s + 1), it(i, e / 2, t * 2);
}
function mc(n, t, e, i) {
  return t = t !== void 0 ? t : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(s, r, o, a) {
    if (s !== void 0) {
      const l = n[0], c = n[n.length - 1], h = e ? br(
        l,
        e,
        o,
        i
      ) : l;
      if (a)
        return t ? Pr(
          s,
          h,
          c
        ) : it(s, c, h);
      const u = Math.min(h, s), d = Math.floor(_r(n, u, r));
      return n[d] > h && d < n.length - 1 ? n[d + 1] : n[d];
    }
  };
}
function pc(n, t, e, i, s, r) {
  return i = i !== void 0 ? i : !0, e = e !== void 0 ? e : 0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(o, a, l, c) {
    if (o !== void 0) {
      const h = s ? br(
        t,
        s,
        l,
        r
      ) : t;
      if (c)
        return i ? Pr(
          o,
          h,
          e
        ) : it(o, e, h);
      const u = 1e-9, d = Math.ceil(
        Math.log(t / h) / Math.log(n) - u
      ), f = -a * (0.5 - u) + 0.5, g = Math.min(h, o), m = Math.floor(
        Math.log(t / g) / Math.log(n) + f
      ), _ = Math.max(d, m), p = t / Math.pow(n, _);
      return it(p, e, h);
    }
  };
}
function vo(n, t, e, i, s) {
  return e = e !== void 0 ? e : !0, /**
   * @param {number|undefined} resolution Resolution.
   * @param {number} direction Direction.
   * @param {import("./size.js").Size} size Viewport size.
   * @param {boolean} [isMoving] True if an interaction or animation is in progress.
   * @return {number|undefined} Resolution.
   */
  function(r, o, a, l) {
    if (r !== void 0) {
      const c = i ? br(
        n,
        i,
        a,
        s
      ) : n;
      return !e || !l ? it(r, t, c) : Pr(
        r,
        c,
        t
      );
    }
  };
}
function Or(n) {
  if (n !== void 0)
    return 0;
}
function Lo(n) {
  if (n !== void 0)
    return n;
}
function yc(n) {
  const t = 2 * Math.PI / n;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, i) {
      if (i)
        return e;
      if (e !== void 0)
        return e = Math.floor(e / t + 0.5) * t, e;
    }
  );
}
function Ec(n) {
  const t = Ae(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {boolean} [isMoving] True if an interaction or animation is in progress.
     * @return {number|undefined} Rotation.
     */
    function(e, i) {
      return i || e === void 0 ? e : Math.abs(e) <= t ? 0 : e;
    }
  );
}
const xc = 42, Dr = 256, Ls = 0;
class ee extends $t {
  /**
   * @param {ViewOptions} [options] View options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = Object.assign({}, t), this.hints_ = [0, 0], this.animations_ = [], this.updateAnimationKey_, this.projection_ = Sr(t.projection, "EPSG:3857"), this.viewportSize_ = [100, 100], this.targetCenter_ = null, this.targetResolution_, this.targetRotation_, this.nextCenter_ = null, this.nextResolution_, this.nextRotation_, this.cancelAnchor_ = void 0, t.projection && Fa(), t.center && (t.center = ce(t.center, this.projection_)), t.extent && (t.extent = ve(t.extent, this.projection_)), this.applyOptions_(t);
  }
  /**
   * Set up the view with the given options.
   * @param {ViewOptions} options View options.
   */
  applyOptions_(t) {
    const e = Object.assign({}, t);
    for (const a in Bt)
      delete e[a];
    this.setProperties(e, !0);
    const i = Cc(t);
    this.maxResolution_ = i.maxResolution, this.minResolution_ = i.minResolution, this.zoomFactor_ = i.zoomFactor, this.resolutions_ = t.resolutions, this.padding_ = t.padding, this.minZoom_ = i.minZoom;
    const s = wc(t), r = i.constraint, o = Rc(t);
    this.constraints_ = {
      center: s,
      resolution: r,
      rotation: o
    }, this.setRotation(t.rotation !== void 0 ? t.rotation : 0), this.setCenterInternal(
      t.center !== void 0 ? t.center : null
    ), t.resolution !== void 0 ? this.setResolution(t.resolution) : t.zoom !== void 0 && this.setZoom(t.zoom);
  }
  /**
   * Padding (in css pixels).
   * If the map viewport is partially covered with other content (overlays) along
   * its edges, this setting allows to shift the center of the viewport away from that
   * content. The order of the values in the array is top, right, bottom, left.
   * The default is no padding, which is equivalent to `[0, 0, 0, 0]`.
   * @type {Array<number>|undefined}
   * @api
   */
  get padding() {
    return this.padding_;
  }
  set padding(t) {
    let e = this.padding_;
    this.padding_ = t;
    const i = this.getCenterInternal();
    if (i) {
      const s = t || [0, 0, 0, 0];
      e = e || [0, 0, 0, 0];
      const r = this.getResolution(), o = r / 2 * (s[3] - e[3] + e[1] - s[1]), a = r / 2 * (s[0] - e[0] + e[2] - s[2]);
      this.setCenterInternal([i[0] + o, i[1] - a]);
    }
  }
  /**
   * Get an updated version of the view options used to construct the view.  The
   * current resolution (or zoom), center, and rotation are applied to any stored
   * options.  The provided options can be used to apply new min/max zoom or
   * resolution limits.
   * @param {ViewOptions} newOptions New options to be applied.
   * @return {ViewOptions} New options updated with the current view state.
   */
  getUpdatedOptions_(t) {
    const e = this.getProperties();
    return e.resolution !== void 0 ? e.resolution = this.getResolution() : e.zoom = this.getZoom(), e.center = this.getCenterInternal(), e.rotation = this.getRotation(), Object.assign({}, e, t);
  }
  /**
   * Animate the view.  The view's center, zoom (or resolution), and rotation
   * can be animated for smooth transitions between view states.  For example,
   * to animate the view to a new zoom level:
   *
   *     view.animate({zoom: view.getZoom() + 1});
   *
   * By default, the animation lasts one second and uses in-and-out easing.  You
   * can customize this behavior by including `duration` (in milliseconds) and
   * `easing` options (see {@link module:ol/easing}).
   *
   * To chain together multiple animations, call the method with multiple
   * animation objects.  For example, to first zoom and then pan:
   *
   *     view.animate({zoom: 10}, {center: [0, 0]});
   *
   * If you provide a function as the last argument to the animate method, it
   * will get called at the end of an animation series.  The callback will be
   * called with `true` if the animation series completed on its own or `false`
   * if it was cancelled.
   *
   * Animations are cancelled by user interactions (e.g. dragging the map) or by
   * calling `view.setCenter()`, `view.setResolution()`, or `view.setRotation()`
   * (or another method that calls one of these).
   *
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation
   *     options.  Multiple animations can be run in series by passing multiple
   *     options objects.  To run multiple animations in parallel, call the method
   *     multiple times.  An optional callback can be provided as a final
   *     argument.  The callback will be called with a boolean indicating whether
   *     the animation completed without being cancelled.
   * @api
   */
  animate(t) {
    this.isDef() && !this.getAnimating() && this.resolveConstraints(0);
    const e = new Array(arguments.length);
    for (let i = 0; i < e.length; ++i) {
      let s = arguments[i];
      s.center && (s = Object.assign({}, s), s.center = ce(
        s.center,
        this.getProjection()
      )), s.anchor && (s = Object.assign({}, s), s.anchor = ce(
        s.anchor,
        this.getProjection()
      )), e[i] = s;
    }
    this.animateInternal.apply(this, e);
  }
  /**
   * @param {...(AnimationOptions|function(boolean): void)} var_args Animation options.
   */
  animateInternal(t) {
    let e = arguments.length, i;
    e > 1 && typeof arguments[e - 1] == "function" && (i = arguments[e - 1], --e);
    let s = 0;
    for (; s < e && !this.isDef(); ++s) {
      const h = arguments[s];
      h.center && this.setCenterInternal(h.center), h.zoom !== void 0 ? this.setZoom(h.zoom) : h.resolution && this.setResolution(h.resolution), h.rotation !== void 0 && this.setRotation(h.rotation);
    }
    if (s === e) {
      i && In(i, !0);
      return;
    }
    let r = Date.now(), o = this.targetCenter_.slice(), a = this.targetResolution_, l = this.targetRotation_;
    const c = [];
    for (; s < e; ++s) {
      const h = (
        /** @type {AnimationOptions} */
        arguments[s]
      ), u = {
        start: r,
        complete: !1,
        anchor: h.anchor,
        duration: h.duration !== void 0 ? h.duration : 1e3,
        easing: h.easing || gh,
        callback: i
      };
      if (h.center && (u.sourceCenter = o, u.targetCenter = h.center.slice(), o = u.targetCenter), h.zoom !== void 0 ? (u.sourceResolution = a, u.targetResolution = this.getResolutionForZoom(h.zoom), a = u.targetResolution) : h.resolution && (u.sourceResolution = a, u.targetResolution = h.resolution, a = u.targetResolution), h.rotation !== void 0) {
        u.sourceRotation = l;
        const d = Be(h.rotation - l + Math.PI, 2 * Math.PI) - Math.PI;
        u.targetRotation = l + d, l = u.targetRotation;
      }
      Sc(u) ? u.complete = !0 : r += u.duration, c.push(u);
    }
    this.animations_.push(c), this.setHint(Et.ANIMATING, 1), this.updateAnimations_();
  }
  /**
   * Determine if the view is being animated.
   * @return {boolean} The view is being animated.
   * @api
   */
  getAnimating() {
    return this.hints_[Et.ANIMATING] > 0;
  }
  /**
   * Determine if the user is interacting with the view, such as panning or zooming.
   * @return {boolean} The view is being interacted with.
   * @api
   */
  getInteracting() {
    return this.hints_[Et.INTERACTING] > 0;
  }
  /**
   * Cancel any ongoing animations.
   * @api
   */
  cancelAnimations() {
    this.setHint(Et.ANIMATING, -this.hints_[Et.ANIMATING]);
    let t;
    for (let e = 0, i = this.animations_.length; e < i; ++e) {
      const s = this.animations_[e];
      if (s[0].callback && In(s[0].callback, !1), !t)
        for (let r = 0, o = s.length; r < o; ++r) {
          const a = s[r];
          if (!a.complete) {
            t = a.anchor;
            break;
          }
        }
    }
    this.animations_.length = 0, this.cancelAnchor_ = t, this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
  }
  /**
   * Update all animations.
   */
  updateAnimations_() {
    if (this.updateAnimationKey_ !== void 0 && (cancelAnimationFrame(this.updateAnimationKey_), this.updateAnimationKey_ = void 0), !this.getAnimating())
      return;
    const t = Date.now();
    let e = !1;
    for (let i = this.animations_.length - 1; i >= 0; --i) {
      const s = this.animations_[i];
      let r = !0;
      for (let o = 0, a = s.length; o < a; ++o) {
        const l = s[o];
        if (l.complete)
          continue;
        const c = t - l.start;
        let h = l.duration > 0 ? c / l.duration : 1;
        h >= 1 ? (l.complete = !0, h = 1) : r = !1;
        const u = l.easing(h);
        if (l.sourceCenter) {
          const d = l.sourceCenter[0], f = l.sourceCenter[1], g = l.targetCenter[0], m = l.targetCenter[1];
          this.nextCenter_ = l.targetCenter;
          const _ = d + u * (g - d), p = f + u * (m - f);
          this.targetCenter_ = [_, p];
        }
        if (l.sourceResolution && l.targetResolution) {
          const d = u === 1 ? l.targetResolution : l.sourceResolution + u * (l.targetResolution - l.sourceResolution);
          if (l.anchor) {
            const f = this.getViewportSize_(this.getRotation()), g = this.constraints_.resolution(
              d,
              0,
              f,
              !0
            );
            this.targetCenter_ = this.calculateCenterZoom(
              g,
              l.anchor
            );
          }
          this.nextResolution_ = l.targetResolution, this.targetResolution_ = d, this.applyTargetState_(!0);
        }
        if (l.sourceRotation !== void 0 && l.targetRotation !== void 0) {
          const d = u === 1 ? Be(l.targetRotation + Math.PI, 2 * Math.PI) - Math.PI : l.sourceRotation + u * (l.targetRotation - l.sourceRotation);
          if (l.anchor) {
            const f = this.constraints_.rotation(
              d,
              !0
            );
            this.targetCenter_ = this.calculateCenterRotate(
              f,
              l.anchor
            );
          }
          this.nextRotation_ = l.targetRotation, this.targetRotation_ = d;
        }
        if (this.applyTargetState_(!0), e = !0, !l.complete)
          break;
      }
      if (r) {
        this.animations_[i] = null, this.setHint(Et.ANIMATING, -1), this.nextCenter_ = null, this.nextResolution_ = NaN, this.nextRotation_ = NaN;
        const o = s[0].callback;
        o && In(o, !0);
      }
    }
    this.animations_ = this.animations_.filter(Boolean), e && this.updateAnimationKey_ === void 0 && (this.updateAnimationKey_ = requestAnimationFrame(
      this.updateAnimations_.bind(this)
    ));
  }
  /**
   * @param {number} rotation Target rotation.
   * @param {import("./coordinate.js").Coordinate} anchor Rotation anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for rotation and anchor.
   */
  calculateCenterRotate(t, e) {
    let i;
    const s = this.getCenterInternal();
    return s !== void 0 && (i = [s[0] - e[0], s[1] - e[1]], yr(i, t - this.getRotation()), uh(i, e)), i;
  }
  /**
   * @param {number} resolution Target resolution.
   * @param {import("./coordinate.js").Coordinate} anchor Zoom anchor.
   * @return {import("./coordinate.js").Coordinate|undefined} Center for resolution and anchor.
   */
  calculateCenterZoom(t, e) {
    let i;
    const s = this.getCenterInternal(), r = this.getResolution();
    if (s !== void 0 && r !== void 0) {
      const o = e[0] - t * (e[0] - s[0]) / r, a = e[1] - t * (e[1] - s[1]) / r;
      i = [o, a];
    }
    return i;
  }
  /**
   * Returns the current viewport size.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size or `[100, 100]` when no viewport is found.
   */
  getViewportSize_(t) {
    const e = this.viewportSize_;
    if (t) {
      const i = e[0], s = e[1];
      return [
        Math.abs(i * Math.cos(t)) + Math.abs(s * Math.sin(t)),
        Math.abs(i * Math.sin(t)) + Math.abs(s * Math.cos(t))
      ];
    }
    return e;
  }
  /**
   * Stores the viewport size on the view. The viewport size is not read every time from the DOM
   * to avoid performance hit and layout reflow.
   * This should be done on map size change.
   * Note: the constraints are not resolved during an animation to avoid stopping it
   * @param {import("./size.js").Size} [size] Viewport size; if undefined, [100, 100] is assumed
   */
  setViewportSize(t) {
    this.viewportSize_ = Array.isArray(t) ? t.slice() : [100, 100], this.getAnimating() || this.resolveConstraints(0);
  }
  /**
   * Get the view center.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   * @observable
   * @api
   */
  getCenter() {
    const t = this.getCenterInternal();
    return t && ar(t, this.getProjection());
  }
  /**
   * Get the view center without transforming to user projection.
   * @return {import("./coordinate.js").Coordinate|undefined} The center of the view.
   */
  getCenterInternal() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(Bt.CENTER)
    );
  }
  /**
   * @return {Constraints} Constraints.
   */
  getConstraints() {
    return this.constraints_;
  }
  /**
   * @return {boolean} Resolution constraint is set
   */
  getConstrainResolution() {
    return this.get("constrainResolution");
  }
  /**
   * @param {Array<number>} [hints] Destination array.
   * @return {Array<number>} Hint.
   */
  getHints(t) {
    return t !== void 0 ? (t[0] = this.hints_[0], t[1] = this.hints_[1], t) : this.hints_.slice();
  }
  /**
   * Calculate the extent for the current view state and the passed box size.
   * @param {import("./size.js").Size} [size] The pixel dimensions of the box
   * into which the calculated extent should fit. Defaults to the size of the
   * map the view is associated with.
   * If no map or multiple maps are connected to the view, provide the desired
   * box size (e.g. `map.getSize()`).
   * @return {import("./extent.js").Extent} Extent.
   * @api
   */
  calculateExtent(t) {
    const e = this.calculateExtentInternal(t);
    return Na(e, this.getProjection());
  }
  /**
   * @param {import("./size.js").Size} [size] Box pixel size. If not provided,
   * the map's last known viewport size will be used.
   * @return {import("./extent.js").Extent} Extent.
   */
  calculateExtentInternal(t) {
    t = t || this.getViewportSizeMinusPadding_();
    const e = (
      /** @type {!import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    $(e, "The view center is not defined");
    const i = (
      /** @type {!number} */
      this.getResolution()
    );
    $(i !== void 0, "The view resolution is not defined");
    const s = (
      /** @type {!number} */
      this.getRotation()
    );
    return $(s !== void 0, "The view rotation is not defined"), nr(e, i, s, t);
  }
  /**
   * Get the maximum resolution of the view.
   * @return {number} The maximum resolution of the view.
   * @api
   */
  getMaxResolution() {
    return this.maxResolution_;
  }
  /**
   * Get the minimum resolution of the view.
   * @return {number} The minimum resolution of the view.
   * @api
   */
  getMinResolution() {
    return this.minResolution_;
  }
  /**
   * Get the maximum zoom level for the view.
   * @return {number} The maximum zoom level.
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.minResolution_)
    );
  }
  /**
   * Set a new maximum zoom level for the view.
   * @param {number} zoom The maximum zoom level.
   * @api
   */
  setMaxZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ maxZoom: t }));
  }
  /**
   * Get the minimum zoom level for the view.
   * @return {number} The minimum zoom level.
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.getZoomForResolution(this.maxResolution_)
    );
  }
  /**
   * Set a new minimum zoom level for the view.
   * @param {number} zoom The minimum zoom level.
   * @api
   */
  setMinZoom(t) {
    this.applyOptions_(this.getUpdatedOptions_({ minZoom: t }));
  }
  /**
   * Set whether the view should allow intermediary zoom levels.
   * @param {boolean} enabled Whether the resolution is constrained.
   * @api
   */
  setConstrainResolution(t) {
    this.applyOptions_(this.getUpdatedOptions_({ constrainResolution: t }));
  }
  /**
   * Get the view projection.
   * @return {import("./proj/Projection.js").default} The projection of the view.
   * @api
   */
  getProjection() {
    return this.projection_;
  }
  /**
   * Get the view resolution.
   * @return {number|undefined} The resolution of the view.
   * @observable
   * @api
   */
  getResolution() {
    return (
      /** @type {number|undefined} */
      this.get(Bt.RESOLUTION)
    );
  }
  /**
   * Get the resolutions for the view. This returns the array of resolutions
   * passed to the constructor of the View, or undefined if none were given.
   * @return {Array<number>|undefined} The resolutions of the view.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   * @api
   */
  getResolutionForExtent(t, e) {
    return this.getResolutionForExtentInternal(
      ve(t, this.getProjection()),
      e
    );
  }
  /**
   * Get the resolution for a provided extent (in map units) and size (in pixels).
   * @param {import("./extent.js").Extent} extent Extent.
   * @param {import("./size.js").Size} [size] Box pixel size.
   * @return {number} The resolution at which the provided extent will render at
   *     the given size.
   */
  getResolutionForExtentInternal(t, e) {
    e = e || this.getViewportSizeMinusPadding_();
    const i = J(t) / e[0], s = Rt(t) / e[1];
    return Math.max(i, s);
  }
  /**
   * Return a function that returns a value between 0 and 1 for a
   * resolution. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Resolution for value function.
   */
  getResolutionForValueFunction(t) {
    t = t || 2;
    const e = this.getConstrainedResolution(this.maxResolution_), i = this.minResolution_, s = Math.log(e / i) / Math.log(t);
    return (
      /**
       * @param {number} value Value.
       * @return {number} Resolution.
       */
      function(r) {
        return e / Math.pow(t, r * s);
      }
    );
  }
  /**
   * Get the view rotation.
   * @return {number} The rotation of the view in radians.
   * @observable
   * @api
   */
  getRotation() {
    return (
      /** @type {number} */
      this.get(Bt.ROTATION)
    );
  }
  /**
   * Return a function that returns a resolution for a value between
   * 0 and 1. Exponential scaling is assumed.
   * @param {number} [power] Power.
   * @return {function(number): number} Value for resolution function.
   */
  getValueForResolutionFunction(t) {
    const e = Math.log(t || 2), i = this.getConstrainedResolution(this.maxResolution_), s = this.minResolution_, r = Math.log(i / s) / e;
    return (
      /**
       * @param {number} resolution Resolution.
       * @return {number} Value.
       */
      function(o) {
        return Math.log(i / o) / e / r;
      }
    );
  }
  /**
   * Returns the size of the viewport minus padding.
   * @private
   * @param {number} [rotation] Take into account the rotation of the viewport when giving the size
   * @return {import("./size.js").Size} Viewport size reduced by the padding.
   */
  getViewportSizeMinusPadding_(t) {
    let e = this.getViewportSize_(t);
    const i = this.padding_;
    return i && (e = [
      e[0] - i[1] - i[3],
      e[1] - i[0] - i[2]
    ]), e;
  }
  /**
   * @return {State} View state.
   */
  getState() {
    const t = this.getProjection(), e = this.getResolution(), i = this.getRotation();
    let s = (
      /** @type {import("./coordinate.js").Coordinate} */
      this.getCenterInternal()
    );
    const r = this.padding_;
    if (r) {
      const o = this.getViewportSizeMinusPadding_();
      s = As(
        s,
        this.getViewportSize_(),
        [o[0] / 2 + r[3], o[1] / 2 + r[0]],
        e,
        i
      );
    }
    return {
      center: s.slice(0),
      projection: t !== void 0 ? t : null,
      resolution: e,
      nextCenter: this.nextCenter_,
      nextResolution: this.nextResolution_,
      nextRotation: this.nextRotation_,
      rotation: i,
      zoom: this.getZoom()
    };
  }
  /**
   * @return {ViewStateLayerStateExtent} Like `FrameState`, but just `viewState` and `extent`.
   */
  getViewStateAndExtent() {
    return {
      viewState: this.getState(),
      extent: this.calculateExtent()
    };
  }
  /**
   * Get the current zoom level. This method may return non-integer zoom levels
   * if the view does not constrain the resolution, or if an interaction or
   * animation is underway.
   * @return {number|undefined} Zoom.
   * @api
   */
  getZoom() {
    let t;
    const e = this.getResolution();
    return e !== void 0 && (t = this.getZoomForResolution(e)), t;
  }
  /**
   * Get the zoom level for a resolution.
   * @param {number} resolution The resolution.
   * @return {number|undefined} The zoom level for the provided resolution.
   * @api
   */
  getZoomForResolution(t) {
    let e = this.minZoom_ || 0, i, s;
    if (this.resolutions_) {
      const r = _r(this.resolutions_, t, 1);
      e = r, i = this.resolutions_[r], r == this.resolutions_.length - 1 ? s = 2 : s = i / this.resolutions_[r + 1];
    } else
      i = this.maxResolution_, s = this.zoomFactor_;
    return e + Math.log(i / t) / Math.log(s);
  }
  /**
   * Get the resolution for a zoom level.
   * @param {number} zoom Zoom level.
   * @return {number} The view resolution for the provided zoom level.
   * @api
   */
  getResolutionForZoom(t) {
    if (this.resolutions_?.length) {
      if (this.resolutions_.length === 1)
        return this.resolutions_[0];
      const e = it(
        Math.floor(t),
        0,
        this.resolutions_.length - 2
      ), i = this.resolutions_[e] / this.resolutions_[e + 1];
      return this.resolutions_[e] / Math.pow(i, it(t - e, 0, 1));
    }
    return this.maxResolution_ / Math.pow(this.zoomFactor_, t - this.minZoom_);
  }
  /**
   * Fit the given geometry or extent based on the given map size and border.
   * The size is pixel dimensions of the box to fit the extent into.
   * In most cases you will want to use the map size, that is `map.getSize()`.
   * Takes care of the map angle.
   * @param {import("./geom/SimpleGeometry.js").default|import("./extent.js").Extent} geometryOrExtent The geometry or
   *     extent to fit the view to.
   * @param {FitOptions} [options] Options.
   * @api
   */
  fit(t, e) {
    let i;
    if ($(
      Array.isArray(t) || typeof /** @type {?} */
      t.getSimplifiedGeometry == "function",
      "Invalid extent or geometry provided as `geometry`"
    ), Array.isArray(t)) {
      $(
        !as(t),
        "Cannot fit empty extent provided as `geometry`"
      );
      const s = ve(t, this.getProjection());
      i = Io(s);
    } else if (t.getType() === "Circle") {
      const s = ve(
        t.getExtent(),
        this.getProjection()
      );
      i = Io(s), i.rotate(this.getRotation(), je(s));
    } else
      i = t;
    this.fitInternal(i, e);
  }
  /**
   * Calculate rotated extent
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @return {import("./extent").Extent} The rotated extent for the geometry.
   */
  rotatedExtentForGeometry(t) {
    const e = this.getRotation(), i = Math.cos(e), s = Math.sin(-e), r = t.getFlatCoordinates(), o = t.getStride();
    let a = 1 / 0, l = 1 / 0, c = -1 / 0, h = -1 / 0;
    for (let u = 0, d = r.length; u < d; u += o) {
      const f = r[u] * i - r[u + 1] * s, g = r[u] * s + r[u + 1] * i;
      a = Math.min(a, f), l = Math.min(l, g), c = Math.max(c, f), h = Math.max(h, g);
    }
    return [a, l, c, h];
  }
  /**
   * @param {import("./geom/SimpleGeometry.js").default} geometry The geometry.
   * @param {FitOptions} [options] Options.
   */
  fitInternal(t, e) {
    e = e || {};
    let i = e.size;
    i || (i = this.getViewportSizeMinusPadding_());
    const s = e.padding !== void 0 ? e.padding : [0, 0, 0, 0], r = e.nearest !== void 0 ? e.nearest : !1;
    let o;
    e.minResolution !== void 0 ? o = e.minResolution : e.maxZoom !== void 0 ? o = this.getResolutionForZoom(e.maxZoom) : o = 0;
    const a = this.rotatedExtentForGeometry(t);
    let l = this.getResolutionForExtentInternal(a, [
      i[0] - s[1] - s[3],
      i[1] - s[0] - s[2]
    ]);
    l = isNaN(l) ? o : Math.max(l, o), l = this.getConstrainedResolution(l, r ? 0 : 1);
    const c = this.getRotation(), h = Math.sin(c), u = Math.cos(c), d = je(a);
    d[0] += (s[1] - s[3]) / 2 * l, d[1] += (s[0] - s[2]) / 2 * l;
    const f = d[0] * u - d[1] * h, g = d[1] * u + d[0] * h, m = this.getConstrainedCenter([f, g], l), _ = e.callback ? e.callback : Qi;
    e.duration !== void 0 ? this.animateInternal(
      {
        resolution: l,
        center: m,
        duration: e.duration,
        easing: e.easing
      },
      _
    ) : (this.targetResolution_ = l, this.targetCenter_ = m, this.applyTargetState_(!1, !0), In(_, !0));
  }
  /**
   * Center on coordinate and view position.
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   * @api
   */
  centerOn(t, e, i) {
    this.centerOnInternal(
      ce(t, this.getProjection()),
      e,
      i
    );
  }
  /**
   * @param {import("./coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("./size.js").Size} size Box pixel size.
   * @param {import("./pixel.js").Pixel} position Position on the view to center on.
   */
  centerOnInternal(t, e, i) {
    this.setCenterInternal(
      As(
        t,
        e,
        i,
        this.getResolution(),
        this.getRotation()
      )
    );
  }
  /**
   * Calculates the shift between map and viewport center.
   * @param {import("./coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {import("./size.js").Size} size Size.
   * @return {Array<number>|undefined} Center shift.
   */
  calculateCenterShift(t, e, i, s) {
    let r;
    const o = this.padding_;
    if (o && t) {
      const a = this.getViewportSizeMinusPadding_(-i), l = As(
        t,
        s,
        [a[0] / 2 + o[3], a[1] / 2 + o[0]],
        e,
        i
      );
      r = [
        t[0] - l[0],
        t[1] - l[1]
      ];
    }
    return r;
  }
  /**
   * @return {boolean} Is defined.
   */
  isDef() {
    return !!this.getCenterInternal() && this.getResolution() !== void 0;
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   * @api
   */
  adjustCenter(t) {
    const e = ar(this.targetCenter_, this.getProjection());
    this.setCenter([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Adds relative coordinates to the center of the view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate} deltaCoordinates Relative value to add.
   */
  adjustCenterInternal(t) {
    const e = this.targetCenter_;
    this.setCenterInternal([
      e[0] + t[0],
      e[1] + t[1]
    ]);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustResolution(t, e) {
    e = e && ce(e, this.getProjection()), this.adjustResolutionInternal(t, e);
  }
  /**
   * Multiply the view resolution by a ratio, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} ratio The ratio to apply on the view resolution.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  adjustResolutionInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), s = this.getViewportSize_(this.getRotation()), r = this.constraints_.resolution(
      this.targetResolution_ * t,
      0,
      s,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterZoom(r, e)), this.targetResolution_ *= t, this.applyTargetState_();
  }
  /**
   * Adds a value to the view zoom level, optionally using an anchor. Any resolution
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom level.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  adjustZoom(t, e) {
    this.adjustResolution(Math.pow(this.zoomFactor_, -t), e);
  }
  /**
   * Adds a value to the view rotation, optionally using an anchor. Any rotation
   * constraint will apply.
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   * @api
   */
  adjustRotation(t, e) {
    e && (e = ce(e, this.getProjection())), this.adjustRotationInternal(t, e);
  }
  /**
   * @param {number} delta Relative value to add to the zoom rotation, in radians.
   * @param {import("./coordinate.js").Coordinate} [anchor] The rotation center.
   */
  adjustRotationInternal(t, e) {
    const i = this.getAnimating() || this.getInteracting(), s = this.constraints_.rotation(
      this.targetRotation_ + t,
      i
    );
    e && (this.targetCenter_ = this.calculateCenterRotate(s, e)), this.targetRotation_ += t, this.applyTargetState_();
  }
  /**
   * Set the center of the current view. Any extent constraint will apply.
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   * @observable
   * @api
   */
  setCenter(t) {
    this.setCenterInternal(
      t && ce(t, this.getProjection())
    );
  }
  /**
   * Set the center using the view projection (not the user projection).
   * @param {import("./coordinate.js").Coordinate|undefined} center The center of the view.
   */
  setCenterInternal(t) {
    this.targetCenter_ = t, this.applyTargetState_();
  }
  /**
   * @param {import("./ViewHint.js").default} hint Hint.
   * @param {number} delta Delta.
   * @return {number} New value.
   */
  setHint(t, e) {
    return this.hints_[t] += e, this.changed(), this.hints_[t];
  }
  /**
   * Set the resolution for this view. Any resolution constraint will apply.
   * @param {number|undefined} resolution The resolution of the view.
   * @observable
   * @api
   */
  setResolution(t) {
    this.targetResolution_ = t, this.applyTargetState_();
  }
  /**
   * Set the rotation for this view. Any rotation constraint will apply.
   * @param {number} rotation The rotation of the view in radians.
   * @observable
   * @api
   */
  setRotation(t) {
    this.targetRotation_ = t, this.applyTargetState_();
  }
  /**
   * Zoom to a specific zoom level. Any resolution constrain will apply.
   * @param {number} zoom Zoom level.
   * @api
   */
  setZoom(t) {
    this.setResolution(this.getResolutionForZoom(t));
  }
  /**
   * Recompute rotation/resolution/center based on target values.
   * Note: we have to compute rotation first, then resolution and center considering that
   * parameters can influence one another in case a view extent constraint is present.
   * @param {boolean} [doNotCancelAnims] Do not cancel animations.
   * @param {boolean} [forceMoving] Apply constraints as if the view is moving.
   * @private
   */
  applyTargetState_(t, e) {
    const i = this.getAnimating() || this.getInteracting() || e, s = this.constraints_.rotation(
      this.targetRotation_,
      i
    ), r = this.getViewportSize_(s), o = this.constraints_.resolution(
      this.targetResolution_,
      0,
      r,
      i
    ), a = this.constraints_.center(
      this.targetCenter_,
      o,
      r,
      i,
      this.calculateCenterShift(
        this.targetCenter_,
        o,
        s,
        r
      )
    );
    this.get(Bt.ROTATION) !== s && this.set(Bt.ROTATION, s), this.get(Bt.RESOLUTION) !== o && (this.set(Bt.RESOLUTION, o), this.set("zoom", this.getZoom(), !0)), (!a || !this.get(Bt.CENTER) || !Xn(this.get(Bt.CENTER), a)) && this.set(Bt.CENTER, a), this.getAnimating() && !t && this.cancelAnimations(), this.cancelAnchor_ = void 0;
  }
  /**
   * If any constraints need to be applied, an animation will be triggered.
   * This is typically done on interaction end.
   * Note: calling this with a duration of 0 will apply the constrained values straight away,
   * without animation.
   * @param {number} [duration] The animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  resolveConstraints(t, e, i) {
    t = t !== void 0 ? t : 200;
    const s = e || 0, r = this.constraints_.rotation(this.targetRotation_), o = this.getViewportSize_(r), a = this.constraints_.resolution(
      this.targetResolution_,
      s,
      o
    ), l = this.constraints_.center(
      this.targetCenter_,
      a,
      o,
      !1,
      this.calculateCenterShift(
        this.targetCenter_,
        a,
        r,
        o
      )
    );
    if (t === 0 && !this.cancelAnchor_) {
      this.targetResolution_ = a, this.targetRotation_ = r, this.targetCenter_ = l, this.applyTargetState_();
      return;
    }
    i = i || (t === 0 ? this.cancelAnchor_ : void 0), this.cancelAnchor_ = void 0, (this.getResolution() !== a || this.getRotation() !== r || !this.getCenterInternal() || !Xn(this.getCenterInternal(), l)) && (this.getAnimating() && this.cancelAnimations(), this.animateInternal({
      rotation: r,
      center: l,
      resolution: a,
      duration: t,
      easing: Ai,
      anchor: i
    }));
  }
  /**
   * Notify the View that an interaction has started.
   * The view state will be resolved to a stable one if needed
   * (depending on its constraints).
   * @api
   */
  beginInteraction() {
    this.resolveConstraints(0), this.setHint(Et.INTERACTING, 1);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   * @api
   */
  endInteraction(t, e, i) {
    i = i && ce(i, this.getProjection()), this.endInteractionInternal(t, e, i);
  }
  /**
   * Notify the View that an interaction has ended. The view state will be resolved
   * to a stable one if needed (depending on its constraints).
   * @param {number} [duration] Animation duration in ms.
   * @param {number} [resolutionDirection] Which direction to zoom.
   * @param {import("./coordinate.js").Coordinate} [anchor] The origin of the transformation.
   */
  endInteractionInternal(t, e, i) {
    this.getInteracting() && (this.setHint(Et.INTERACTING, -1), this.resolveConstraints(t, e, i));
  }
  /**
   * Get a valid position for the view center according to the current constraints.
   * @param {import("./coordinate.js").Coordinate|undefined} targetCenter Target center position.
   * @param {number} [targetResolution] Target resolution. If not supplied, the current one will be used.
   * This is useful to guess a valid center position at a different zoom level.
   * @return {import("./coordinate.js").Coordinate|undefined} Valid center position.
   */
  getConstrainedCenter(t, e) {
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.center(
      t,
      e || this.getResolution(),
      i
    );
  }
  /**
   * Get a valid zoom level according to the current view constraints.
   * @param {number|undefined} targetZoom Target zoom.
   * @param {number} [direction] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid zoom level.
   */
  getConstrainedZoom(t, e) {
    const i = this.getResolutionForZoom(t);
    return this.getZoomForResolution(
      this.getConstrainedResolution(i, e)
    );
  }
  /**
   * Get a valid resolution according to the current view constraints.
   * @param {number|undefined} targetResolution Target resolution.
   * @param {number} [direction] Indicate which resolution should be used
   * by a renderer if the view resolution does not match any resolution of the tile source.
   * If 0, the nearest resolution will be used. If 1, the nearest lower resolution
   * will be used. If -1, the nearest higher resolution will be used.
   * @return {number|undefined} Valid resolution.
   */
  getConstrainedResolution(t, e) {
    e = e || 0;
    const i = this.getViewportSize_(this.getRotation());
    return this.constraints_.resolution(t, e, i);
  }
}
function In(n, t) {
  setTimeout(function() {
    n(t);
  }, 0);
}
function wc(n) {
  if (n.extent !== void 0) {
    const e = n.smoothExtentConstraint !== void 0 ? n.smoothExtentConstraint : !0;
    return ao(n.extent, n.constrainOnlyCenter, e);
  }
  const t = Sr(n.projection, "EPSG:3857");
  if (n.multiWorld !== !0 && t.isGlobal()) {
    const e = t.getExtent().slice();
    return e[0] = -1 / 0, e[2] = 1 / 0, ao(e, !1, !1);
  }
  return rh;
}
function Cc(n) {
  let t, e, i, o = n.minZoom !== void 0 ? n.minZoom : Ls, a = n.maxZoom !== void 0 ? n.maxZoom : 28;
  const l = n.zoomFactor !== void 0 ? n.zoomFactor : 2, c = n.multiWorld !== void 0 ? n.multiWorld : !1, h = n.smoothResolutionConstraint !== void 0 ? n.smoothResolutionConstraint : !0, u = n.showFullExtent !== void 0 ? n.showFullExtent : !1, d = Sr(n.projection, "EPSG:3857"), f = d.getExtent();
  let g = n.constrainOnlyCenter, m = n.extent;
  if (!c && !m && d.isGlobal() && (g = !1, m = f), n.resolutions !== void 0) {
    const _ = n.resolutions;
    e = _[o], i = _[a] !== void 0 ? _[a] : _[_.length - 1], n.constrainResolution ? t = mc(
      _,
      h,
      !g && m,
      u
    ) : t = vo(
      e,
      i,
      h,
      !g && m,
      u
    );
  } else {
    const p = (f ? Math.max(J(f), Rt(f)) : (
      // use an extent that can fit the whole world if need be
      360 * Er.degrees / d.getMetersPerUnit()
    )) / Dr / Math.pow(2, Ls), E = p / Math.pow(2, 28 - Ls);
    e = n.maxResolution, e !== void 0 ? o = 0 : e = p / Math.pow(l, o), i = n.minResolution, i === void 0 && (n.maxZoom !== void 0 ? n.maxResolution !== void 0 ? i = e / Math.pow(l, a) : i = p / Math.pow(l, a) : i = E), a = o + Math.floor(
      Math.log(e / i) / Math.log(l)
    ), i = e / Math.pow(l, a - o), n.constrainResolution ? t = pc(
      l,
      e,
      i,
      h,
      !g && m,
      u
    ) : t = vo(
      e,
      i,
      h,
      !g && m,
      u
    );
  }
  return {
    constraint: t,
    maxResolution: e,
    minResolution: i,
    minZoom: o,
    zoomFactor: l
  };
}
function Rc(n) {
  if (n.enableRotation !== void 0 ? n.enableRotation : !0) {
    const e = n.constrainRotation;
    return e === void 0 || e === !0 ? Ec() : e === !1 ? Lo : typeof e == "number" ? yc(e) : Lo;
  }
  return Or;
}
function Sc(n) {
  return !(n.sourceCenter && n.targetCenter && !Xn(n.sourceCenter, n.targetCenter) || n.sourceResolution !== n.targetResolution || n.sourceRotation !== n.targetRotation);
}
function As(n, t, e, i, s) {
  const r = Math.cos(-s);
  let o = Math.sin(-s), a = n[0] * r - n[1] * o, l = n[1] * r + n[0] * o;
  a += (t[0] / 2 - e[0]) * i, l += (e[1] - t[1] / 2) * i, o = -o;
  const c = a * r - l * o, h = l * r + a * o;
  return [c, h];
}
const vn = "ol-hidden", Tc = "ol-selectable", ds = "ol-unselectable", Fr = "ol-control", Ao = "ol-collapsed", Ic = new RegExp(
  [
    "^\\s*(?=(?:(?:[-a-z]+\\s*){0,2}(italic|oblique))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(small-caps))?)",
    "(?=(?:(?:[-a-z]+\\s*){0,2}(bold(?:er)?|lighter|[1-9]00 ))?)",
    "(?:(?:normal|\\1|\\2|\\3)\\s*){0,3}((?:xx?-)?",
    "(?:small|large)|medium|smaller|larger|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx]))",
    "(?:\\s*\\/\\s*(normal|[\\.\\d]+(?:\\%|in|[cem]m|ex|p[ctx])?))",
    `?\\s*([-,\\"\\'\\sa-z0-9]+?)\\s*$`
  ].join(""),
  "i"
), Mo = [
  "style",
  "variant",
  "weight",
  "size",
  "lineHeight",
  "family"
], ja = function(n) {
  const t = n.match(Ic);
  if (!t)
    return null;
  const e = (
    /** @type {FontParameters} */
    {
      lineHeight: "normal",
      size: "1.2em",
      style: "normal",
      weight: "normal",
      variant: "normal"
    }
  );
  for (let i = 0, s = Mo.length; i < s; ++i) {
    const r = t[i + 1];
    r !== void 0 && (e[Mo[i]] = r);
  }
  return e.families = e.family.split(/,\s?/), e;
};
function at(n, t, e, i) {
  let s;
  return e && e.length ? s = /** @type {HTMLCanvasElement} */
  e.shift() : _a ? s = new OffscreenCanvas(n || 300, t || 300) : s = document.createElement("canvas"), n && (s.width = n), t && (s.height = t), /** @type {CanvasRenderingContext2D} */
  s.getContext("2d", i);
}
let Ms;
function Zn() {
  return Ms || (Ms = at(1, 1)), Ms;
}
function fs(n) {
  const t = n.canvas;
  t.width = 1, t.height = 1, n.clearRect(0, 0, 1, 1);
}
function vc(n) {
  let t = n.offsetWidth;
  const e = getComputedStyle(n);
  return t += parseInt(e.marginLeft, 10) + parseInt(e.marginRight, 10), t;
}
function Lc(n) {
  let t = n.offsetHeight;
  const e = getComputedStyle(n);
  return t += parseInt(e.marginTop, 10) + parseInt(e.marginBottom, 10), t;
}
function bo(n, t) {
  const e = t.parentNode;
  e && e.replaceChild(n, t);
}
function Ha(n) {
  for (; n.lastChild; )
    n.lastChild.remove();
}
function Ac(n, t) {
  const e = n.childNodes;
  for (let i = 0; ; ++i) {
    const s = e[i], r = t[i];
    if (!s && !r)
      break;
    if (s !== r) {
      if (!s) {
        n.appendChild(r);
        continue;
      }
      if (!r) {
        n.removeChild(s), --i;
        continue;
      }
      n.insertBefore(r, s);
    }
  }
}
class kr extends $t {
  /**
   * @param {Options} options Control options.
   */
  constructor(t) {
    super();
    const e = t.element;
    e && !t.target && !e.style.pointerEvents && (e.style.pointerEvents = "auto"), this.element = e || null, this.target_ = null, this.map_ = null, this.listenerKeys = [], t.render && (this.render = t.render), t.target && this.setTarget(t.target);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.element?.remove(), super.disposeInternal();
  }
  /**
   * Get the map associated with this control.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Remove the control from its current map and attach it to the new map.
   * Pass `null` to just remove the control from the current map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.map_ && this.element?.remove();
    for (let e = 0, i = this.listenerKeys.length; e < i; ++e)
      tt(this.listenerKeys[e]);
    if (this.listenerKeys.length = 0, this.map_ = t, t) {
      const e = this.target_ ?? t.getOverlayContainerStopEvent();
      this.element && e.appendChild(this.element), this.render !== Qi && this.listenerKeys.push(
        U(t, de.POSTRENDER, this.render, this)
      ), t.render();
    }
  }
  /**
   * Renders the control.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @api
   */
  render(t) {
  }
  /**
   * This function is used to set a target element for the control. It has no
   * effect if it is called after the control has been added to the map (i.e.
   * after `setMap` is called on the control). If no `target` is set in the
   * options passed to the control constructor and if `setTarget` is not called
   * then the control is added to the map's overlay container.
   * @param {HTMLElement|string} target Target.
   * @api
   */
  setTarget(t) {
    this.target_ = typeof t == "string" ? document.getElementById(t) : t;
  }
}
class Mc extends kr {
  /**
   * @param {Options} [options] Attribution options.
   */
  constructor(t) {
    t = t || {}, super({
      element: document.createElement("div"),
      render: t.render,
      target: t.target
    }), this.ulElement_ = document.createElement("ul"), this.collapsed_ = t.collapsed !== void 0 ? t.collapsed : !0, this.userCollapsed_ = this.collapsed_, this.overrideCollapsible_ = t.collapsible !== void 0, this.collapsible_ = t.collapsible !== void 0 ? t.collapsible : !0, this.collapsible_ || (this.collapsed_ = !1), this.attributions_ = t.attributions;
    const e = t.className !== void 0 ? t.className : "ol-attribution", i = t.tipLabel !== void 0 ? t.tipLabel : "Attributions", s = t.expandClassName !== void 0 ? t.expandClassName : e + "-expand", r = t.collapseLabel !== void 0 ? t.collapseLabel : "›", o = t.collapseClassName !== void 0 ? t.collapseClassName : e + "-collapse";
    typeof r == "string" ? (this.collapseLabel_ = document.createElement("span"), this.collapseLabel_.textContent = r, this.collapseLabel_.className = o) : this.collapseLabel_ = r;
    const a = t.label !== void 0 ? t.label : "i";
    typeof a == "string" ? (this.label_ = document.createElement("span"), this.label_.textContent = a, this.label_.className = s) : this.label_ = a;
    const l = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
    this.toggleButton_ = document.createElement("button"), this.toggleButton_.setAttribute("type", "button"), this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_)), this.toggleButton_.title = i, this.toggleButton_.appendChild(l), this.toggleButton_.addEventListener(
      z.CLICK,
      this.handleClick_.bind(this),
      !1
    );
    const c = e + " " + ds + " " + Fr + (this.collapsed_ && this.collapsible_ ? " " + Ao : "") + (this.collapsible_ ? "" : " ol-uncollapsible"), h = this.element;
    h.className = c, h.appendChild(this.toggleButton_), h.appendChild(this.ulElement_), this.renderedAttributions_ = [], this.renderedVisible_ = !0;
  }
  /**
   * Collect a list of visible attributions and set the collapsible state.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {Array<string>} Attributions.
   * @private
   */
  collectSourceAttributions_(t) {
    const e = this.getMap().getAllLayers(), i = new Set(
      e.flatMap((s) => s.getAttributions(t))
    );
    if (this.attributions_ !== void 0 && (Array.isArray(this.attributions_) ? this.attributions_.forEach((s) => i.add(s)) : i.add(this.attributions_)), !this.overrideCollapsible_) {
      const s = !e.some(
        (r) => r.getSource()?.getAttributionsCollapsible() === !1
      );
      this.setCollapsible(s);
    }
    return Array.from(i);
  }
  /**
   * @private
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  async updateElement_(t) {
    if (!t) {
      this.renderedVisible_ && (this.element.style.display = "none", this.renderedVisible_ = !1);
      return;
    }
    const e = await Promise.all(
      this.collectSourceAttributions_(t).map(
        (s) => Ul(() => s)
      )
    ), i = e.length > 0;
    if (this.renderedVisible_ != i && (this.element.style.display = i ? "" : "none", this.renderedVisible_ = i), !Pe(e, this.renderedAttributions_)) {
      Ha(this.ulElement_);
      for (let s = 0, r = e.length; s < r; ++s) {
        const o = document.createElement("li");
        o.innerHTML = e[s], this.ulElement_.appendChild(o);
      }
      this.renderedAttributions_ = e;
    }
  }
  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(t) {
    t.preventDefault(), this.handleToggle_(), this.userCollapsed_ = this.collapsed_;
  }
  /**
   * @private
   */
  handleToggle_() {
    this.element.classList.toggle(Ao), this.collapsed_ ? bo(this.collapseLabel_, this.label_) : bo(this.label_, this.collapseLabel_), this.collapsed_ = !this.collapsed_, this.toggleButton_.setAttribute("aria-expanded", String(!this.collapsed_));
  }
  /**
   * Return `true` if the attribution is collapsible, `false` otherwise.
   * @return {boolean} True if the widget is collapsible.
   * @api
   */
  getCollapsible() {
    return this.collapsible_;
  }
  /**
   * Set whether the attribution should be collapsible.
   * @param {boolean} collapsible True if the widget is collapsible.
   * @api
   */
  setCollapsible(t) {
    this.collapsible_ !== t && (this.collapsible_ = t, this.element.classList.toggle("ol-uncollapsible"), this.userCollapsed_ && this.handleToggle_());
  }
  /**
   * Collapse or expand the attribution according to the passed parameter. Will
   * not do anything if the attribution isn't collapsible or if the current
   * collapsed state is already the one requested.
   * @param {boolean} collapsed True if the widget is collapsed.
   * @api
   */
  setCollapsed(t) {
    this.userCollapsed_ = t, !(!this.collapsible_ || this.collapsed_ === t) && this.handleToggle_();
  }
  /**
   * Return `true` when the attribution is currently collapsed or `false`
   * otherwise.
   * @return {boolean} True if the widget is collapsed.
   * @api
   */
  getCollapsed() {
    return this.collapsed_;
  }
  /**
   * Update the attribution element.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @override
   */
  render(t) {
    this.updateElement_(t.frameState);
  }
}
class bc extends kr {
  /**
   * @param {Options} [options] Rotate options.
   */
  constructor(t) {
    t = t || {}, super({
      element: document.createElement("div"),
      render: t.render,
      target: t.target
    });
    const e = t.className !== void 0 ? t.className : "ol-rotate", i = t.label !== void 0 ? t.label : "⇧", s = t.compassClassName !== void 0 ? t.compassClassName : "ol-compass";
    this.label_ = null, typeof i == "string" ? (this.label_ = document.createElement("span"), this.label_.className = s, this.label_.textContent = i) : (this.label_ = i, this.label_.classList.add(s));
    const r = t.tipLabel ? t.tipLabel : "Reset rotation", o = document.createElement("button");
    o.className = e + "-reset", o.setAttribute("type", "button"), o.title = r, o.appendChild(this.label_), o.addEventListener(
      z.CLICK,
      this.handleClick_.bind(this),
      !1
    );
    const a = e + " " + ds + " " + Fr, l = this.element;
    l.className = a, l.appendChild(o), this.callResetNorth_ = t.resetNorth ? t.resetNorth : void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.autoHide_ = t.autoHide !== void 0 ? t.autoHide : !0, this.rotation_ = void 0, this.autoHide_ && this.element.classList.add(vn);
  }
  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(t) {
    t.preventDefault(), this.callResetNorth_ !== void 0 ? this.callResetNorth_() : this.resetNorth_();
  }
  /**
   * @private
   */
  resetNorth_() {
    const e = this.getMap().getView();
    if (!e)
      return;
    const i = e.getRotation();
    i !== void 0 && (this.duration_ > 0 && i % (2 * Math.PI) !== 0 ? e.animate({
      rotation: 0,
      duration: this.duration_,
      easing: Ai
    }) : e.setRotation(0));
  }
  /**
   * Update the rotate control element.
   * @param {import("../MapEvent.js").default} mapEvent Map event.
   * @override
   */
  render(t) {
    const e = t.frameState;
    if (!e)
      return;
    const i = e.viewState.rotation;
    if (i != this.rotation_) {
      const s = "rotate(" + i + "rad)";
      if (this.autoHide_) {
        const r = this.element.classList.contains(vn);
        !r && i === 0 ? this.element.classList.add(vn) : r && i !== 0 && this.element.classList.remove(vn);
      }
      this.label_.style.transform = s;
    }
    this.rotation_ = i;
  }
}
class Pc extends kr {
  /**
   * @param {Options} [options] Zoom options.
   */
  constructor(t) {
    t = t || {}, super({
      element: document.createElement("div"),
      target: t.target
    });
    const e = t.className !== void 0 ? t.className : "ol-zoom", i = t.delta !== void 0 ? t.delta : 1, s = t.zoomInClassName !== void 0 ? t.zoomInClassName : e + "-in", r = t.zoomOutClassName !== void 0 ? t.zoomOutClassName : e + "-out", o = t.zoomInLabel !== void 0 ? t.zoomInLabel : "+", a = t.zoomOutLabel !== void 0 ? t.zoomOutLabel : "–", l = t.zoomInTipLabel !== void 0 ? t.zoomInTipLabel : "Zoom in", c = t.zoomOutTipLabel !== void 0 ? t.zoomOutTipLabel : "Zoom out", h = document.createElement("button");
    h.className = s, h.setAttribute("type", "button"), h.title = l, h.appendChild(
      typeof o == "string" ? document.createTextNode(o) : o
    ), h.addEventListener(
      z.CLICK,
      this.handleClick_.bind(this, i),
      !1
    );
    const u = document.createElement("button");
    u.className = r, u.setAttribute("type", "button"), u.title = c, u.appendChild(
      typeof a == "string" ? document.createTextNode(a) : a
    ), u.addEventListener(
      z.CLICK,
      this.handleClick_.bind(this, -i),
      !1
    );
    const d = e + " " + ds + " " + Fr, f = this.element;
    f.className = d, f.appendChild(h), f.appendChild(u), this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * @param {number} delta Zoom delta.
   * @param {MouseEvent} event The event to handle
   * @private
   */
  handleClick_(t, e) {
    e.preventDefault(), this.zoomByDelta_(t);
  }
  /**
   * @param {number} delta Zoom delta.
   * @private
   */
  zoomByDelta_(t) {
    const i = this.getMap().getView();
    if (!i)
      return;
    const s = i.getZoom();
    if (s !== void 0) {
      const r = i.getConstrainedZoom(s + t);
      this.duration_ > 0 ? (i.getAnimating() && i.cancelAnimations(), i.animate({
        zoom: r,
        duration: this.duration_,
        easing: Ai
      })) : i.setZoom(r);
    }
  }
}
function Oc(n) {
  n = n || {};
  const t = new Ut();
  return (n.zoom !== void 0 ? n.zoom : !0) && t.push(new Pc(n.zoomOptions)), (n.rotate !== void 0 ? n.rotate : !0) && t.push(new bc(n.rotateOptions)), (n.attribution !== void 0 ? n.attribution : !0) && t.push(new Mc(n.attributionOptions)), t;
}
class Dc {
  /**
   * @param {number} decay Rate of decay (must be negative).
   * @param {number} minVelocity Minimum velocity (pixels/millisecond).
   * @param {number} delay Delay to consider to calculate the kinetic
   *     initial values (milliseconds).
   */
  constructor(t, e, i) {
    this.decay_ = t, this.minVelocity_ = e, this.delay_ = i, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0;
  }
  /**
   * FIXME empty description for jsdoc
   */
  begin() {
    this.points_.length = 0, this.angle_ = 0, this.initialVelocity_ = 0;
  }
  /**
   * @param {number} x X.
   * @param {number} y Y.
   */
  update(t, e) {
    this.points_.push(t, e, Date.now());
  }
  /**
   * @return {boolean} Whether we should do kinetic animation.
   */
  end() {
    if (this.points_.length < 6)
      return !1;
    const t = Date.now() - this.delay_, e = this.points_.length - 3;
    if (this.points_[e + 2] < t)
      return !1;
    let i = e - 3;
    for (; i > 0 && this.points_[i + 2] > t; )
      i -= 3;
    const s = this.points_[e + 2] - this.points_[i + 2];
    if (s < 1e3 / 60)
      return !1;
    const r = this.points_[e] - this.points_[i], o = this.points_[e + 1] - this.points_[i + 1];
    return this.angle_ = Math.atan2(o, r), this.initialVelocity_ = Math.sqrt(r * r + o * o) / s, this.initialVelocity_ > this.minVelocity_;
  }
  /**
   * @return {number} Total distance travelled (pixels).
   */
  getDistance() {
    return (this.minVelocity_ - this.initialVelocity_) / this.decay_;
  }
  /**
   * @return {number} Angle of the kinetic panning animation (radians).
   */
  getAngle() {
    return this.angle_;
  }
}
const Po = {
  ACTIVE: "active"
};
class Mi extends $t {
  /**
   * @param {InteractionOptions} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t && t.handleEvent && (this.handleEvent = t.handleEvent), this.map_ = null, this.setActive(!0);
  }
  /**
   * Return whether the interaction is currently active.
   * @return {boolean} `true` if the interaction is active, `false` otherwise.
   * @observable
   * @api
   */
  getActive() {
    return (
      /** @type {boolean} */
      this.get(Po.ACTIVE)
    );
  }
  /**
   * Get the map associated with this interaction.
   * @return {import("../Map.js").default|null} Map.
   * @api
   */
  getMap() {
    return this.map_;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event}.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  handleEvent(t) {
    return !0;
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  setActive(t) {
    this.set(Po.ACTIVE, t);
  }
  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    this.map_ = t;
  }
}
function Fc(n, t, e) {
  const i = n.getCenterInternal();
  if (i) {
    const s = [i[0] + t[0], i[1] + t[1]];
    n.animateInternal({
      duration: e !== void 0 ? e : 250,
      easing: _h,
      center: n.getConstrainedCenter(s)
    });
  }
}
function Nr(n, t, e, i) {
  const s = n.getZoom();
  if (s === void 0)
    return;
  const r = n.getConstrainedZoom(s + t), o = n.getResolutionForZoom(r);
  n.getAnimating() && n.cancelAnimations(), n.animate({
    resolution: o,
    anchor: e,
    duration: i !== void 0 ? i : 250,
    easing: Ai
  });
}
class kc extends Mi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.delta_ = t.delta ? t.delta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a
   * doubleclick) and eventually zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == et.DBLCLICK) {
      const i = (
        /** @type {MouseEvent} */
        t.originalEvent
      ), s = t.map, r = t.coordinate, o = i.shiftKey ? -this.delta_ : this.delta_, a = s.getView();
      Nr(a, o, r, this.duration_), i.preventDefault(), e = !0;
    }
    return !e;
  }
}
function lr(n) {
  const t = arguments;
  return function(e) {
    let i = !0;
    for (let s = 0, r = t.length; s < r && (i = i && t[s](e), !!i); ++s)
      ;
    return i;
  };
}
const Nc = function(n) {
  const t = n.originalEvent;
  return t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, Gc = function(n) {
  const t = n.map.getTargetElement(), e = t.getRootNode(), i = n.map.getOwnerDocument().activeElement;
  return e instanceof ShadowRoot ? e.host.contains(i) : t.contains(i);
}, $a = function(n) {
  const t = n.map.getTargetElement(), e = t.getRootNode();
  return (e instanceof ShadowRoot ? e.host : t).hasAttribute("tabindex") ? Gc(n) : !0;
}, zc = Ze, qa = function(n) {
  const t = n.originalEvent;
  return t instanceof PointerEvent && t.button == 0 && !(ql && ga && t.ctrlKey);
}, Oo = fn, Ja = function(n) {
  return n.type == et.SINGLECLICK;
}, Qa = function(n) {
  const t = (
    /** @type {KeyboardEvent|MouseEvent|TouchEvent} */
    n.originalEvent
  );
  return !t.altKey && !(t.metaKey || t.ctrlKey) && !t.shiftKey;
}, Wc = function(n) {
  const t = n.originalEvent;
  return ga ? t.metaKey : t.ctrlKey;
}, tl = function(n) {
  const t = n.originalEvent;
  return !t.altKey && !(t.metaKey || t.ctrlKey) && t.shiftKey;
}, el = function(n) {
  const t = n.originalEvent, e = (
    /** @type {Element} */
    t.target.tagName
  );
  return e !== "INPUT" && e !== "SELECT" && e !== "TEXTAREA" && // `isContentEditable` is only available on `HTMLElement`, but it may also be a
  // different type like `SVGElement`.
  // @ts-ignore
  !t.target.isContentEditable;
}, bs = function(n) {
  const t = n.originalEvent;
  return t instanceof PointerEvent && t.pointerType == "mouse";
}, Xc = function(n) {
  const t = n.originalEvent;
  return t instanceof PointerEvent && t.isPrimary && t.button === 0;
};
class mn extends Mi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), t.handleDownEvent && (this.handleDownEvent = t.handleDownEvent), t.handleDragEvent && (this.handleDragEvent = t.handleDragEvent), t.handleMoveEvent && (this.handleMoveEvent = t.handleMoveEvent), t.handleUpEvent && (this.handleUpEvent = t.handleUpEvent), t.stopDown && (this.stopDown = t.stopDown), this.handlingDownUpSequence = !1, this.targetPointers = [];
  }
  /**
   * Returns the current number of pointers involved in the interaction,
   * e.g. `2` when two fingers are used.
   * @return {number} The number of pointers.
   * @api
   */
  getPointerCount() {
    return this.targetPointers.length;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleDownEvent(t) {
    return !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleDragEvent(t) {
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may call into
   * other functions, if event sequences like e.g. 'drag' or 'down-up' etc. are
   * detected.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   * @override
   */
  handleEvent(t) {
    if (!t.originalEvent)
      return !0;
    let e = !1;
    if (this.updateTrackedPointers_(t), this.handlingDownUpSequence) {
      if (t.type == et.POINTERDRAG)
        this.handleDragEvent(t), t.originalEvent.preventDefault();
      else if (t.type == et.POINTERUP) {
        const i = this.handleUpEvent(t);
        this.handlingDownUpSequence = i && this.targetPointers.length > 0;
      }
    } else if (t.type == et.POINTERDOWN) {
      const i = this.handleDownEvent(t);
      this.handlingDownUpSequence = i, e = this.stopDown(i);
    } else t.type == et.POINTERMOVE && this.handleMoveEvent(t);
    return !e;
  }
  /**
   * Handle pointer move events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @protected
   */
  handleMoveEvent(t) {
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @protected
   */
  handleUpEvent(t) {
    return !1;
  }
  /**
   * This function is used to determine if "down" events should be propagated
   * to other interactions or should be stopped.
   * @param {boolean} handled Was the event handled by the interaction?
   * @return {boolean} Should the `down` event be stopped?
   */
  stopDown(t) {
    return t;
  }
  /**
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @private
   */
  updateTrackedPointers_(t) {
    t.activePointers && (this.targetPointers = t.activePointers);
  }
}
function Gr(n) {
  const t = n.length;
  let e = 0, i = 0;
  for (let s = 0; s < t; s++)
    e += n[s].clientX, i += n[s].clientY;
  return { clientX: e / t, clientY: i / t };
}
class Yc extends mn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super({
      stopDown: fn
    }), t = t || {}, this.kinetic_ = t.kinetic, this.lastCentroid = null, this.lastPointersCount_, this.panning_ = !1;
    const e = t.condition ? t.condition : lr(Qa, Xc);
    this.condition_ = t.onFocusOnly ? lr($a, e) : e, this.noKinetic_ = !1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    const e = t.map;
    this.panning_ || (this.panning_ = !0, e.getView().beginInteraction());
    const i = this.targetPointers, s = e.getEventPixel(Gr(i));
    if (i.length == this.lastPointersCount_) {
      if (this.kinetic_ && this.kinetic_.update(s[0], s[1]), this.lastCentroid) {
        const r = [
          this.lastCentroid[0] - s[0],
          s[1] - this.lastCentroid[1]
        ], a = t.map.getView();
        dh(r, a.getResolution()), yr(r, a.getRotation()), a.adjustCenterInternal(r);
      }
    } else this.kinetic_ && this.kinetic_.begin();
    this.lastCentroid = s, this.lastPointersCount_ = i.length, t.originalEvent.preventDefault();
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    const e = t.map, i = e.getView();
    if (this.targetPointers.length === 0) {
      if (!this.noKinetic_ && this.kinetic_ && this.kinetic_.end()) {
        const s = this.kinetic_.getDistance(), r = this.kinetic_.getAngle(), o = i.getCenterInternal(), a = e.getPixelFromCoordinateInternal(o), l = e.getCoordinateFromPixelInternal([
          a[0] - s * Math.cos(r),
          a[1] - s * Math.sin(r)
        ]);
        i.animateInternal({
          center: i.getConstrainedCenter(l),
          duration: 500,
          easing: Ai
        });
      }
      return this.panning_ && (this.panning_ = !1, i.endInteraction()), !1;
    }
    return this.kinetic_ && this.kinetic_.begin(), this.lastCentroid = null, !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (this.targetPointers.length > 0 && this.condition_(t)) {
      const i = t.map.getView();
      return this.lastCentroid = null, i.getAnimating() && i.cancelAnimations(), this.kinetic_ && this.kinetic_.begin(), this.noKinetic_ = this.targetPointers.length > 1, !0;
    }
    return !1;
  }
}
class Kc extends mn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super({
      stopDown: fn
    }), this.condition_ = t.condition ? t.condition : Nc, this.lastAngle_ = void 0, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    if (!bs(t))
      return;
    const e = t.map, i = e.getView();
    if (i.getConstraints().rotation === Or)
      return;
    const s = e.getSize(), r = t.pixel, o = Math.atan2(s[1] / 2 - r[1], r[0] - s[0] / 2);
    if (this.lastAngle_ !== void 0) {
      const a = o - this.lastAngle_;
      i.adjustRotationInternal(-a);
    }
    this.lastAngle_ = o;
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    return bs(t) ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return bs(t) && qa(t) && this.condition_(t) ? (t.map.getView().beginInteraction(), this.lastAngle_ = void 0, !0) : !1;
  }
}
class Bc extends ts {
  /**
   * @param {string} className CSS class name.
   */
  constructor(t) {
    super(), this.geometry_ = null, this.element_ = document.createElement("div"), this.element_.style.position = "absolute", this.element_.style.pointerEvents = "auto", this.element_.className = "ol-box " + t, this.map_ = null, this.startPixel_ = null, this.endPixel_ = null;
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.setMap(null);
  }
  /**
   * @private
   */
  render_() {
    const t = this.startPixel_, e = this.endPixel_, i = "px", s = this.element_.style;
    s.left = Math.min(t[0], e[0]) + i, s.top = Math.min(t[1], e[1]) + i, s.width = Math.abs(e[0] - t[0]) + i, s.height = Math.abs(e[1] - t[1]) + i;
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   */
  setMap(t) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      const e = this.element_.style;
      e.left = "inherit", e.top = "inherit", e.width = "inherit", e.height = "inherit";
    }
    this.map_ = t, this.map_ && this.map_.getOverlayContainer().appendChild(this.element_);
  }
  /**
   * @param {import("../pixel.js").Pixel} startPixel Start pixel.
   * @param {import("../pixel.js").Pixel} endPixel End pixel.
   */
  setPixels(t, e) {
    this.startPixel_ = t, this.endPixel_ = e, this.createOrUpdateGeometry(), this.render_();
  }
  /**
   * Creates or updates the cached geometry.
   */
  createOrUpdateGeometry() {
    if (!this.map_)
      return;
    const t = this.startPixel_, e = this.endPixel_, s = [
      t,
      [t[0], e[1]],
      e,
      [e[0], t[1]]
    ].map(
      this.map_.getCoordinateFromPixelInternal,
      this.map_
    );
    s[4] = s[0].slice(), this.geometry_ ? this.geometry_.setCoordinates([s]) : this.geometry_ = new sn([s]);
  }
  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  getGeometry() {
    return this.geometry_;
  }
}
const ni = {
  /**
   * Triggered upon drag box start.
   * @event DragBoxEvent#boxstart
   * @api
   */
  BOXSTART: "boxstart",
  /**
   * Triggered on drag when box is active.
   * @event DragBoxEvent#boxdrag
   * @api
   */
  BOXDRAG: "boxdrag",
  /**
   * Triggered upon drag box end.
   * @event DragBoxEvent#boxend
   * @api
   */
  BOXEND: "boxend",
  /**
   * Triggered upon drag box canceled.
   * @event DragBoxEvent#boxcancel
   * @api
   */
  BOXCANCEL: "boxcancel"
};
class Gi extends se {
  /**
   * @param {string} type The event type.
   * @param {import("../coordinate.js").Coordinate} coordinate The event coordinate.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Originating event.
   */
  constructor(t, e, i) {
    super(t), this.coordinate = e, this.mapBrowserEvent = i;
  }
}
class Vc extends mn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t ?? {}, this.box_ = new Bc(t.className || "ol-dragbox"), this.minArea_ = t.minArea ?? 64, t.onBoxEnd && (this.onBoxEnd = t.onBoxEnd), this.startPixel_ = null, this.condition_ = t.condition ?? qa, this.boxEndCondition_ = t.boxEndCondition ?? this.defaultBoxEndCondition;
  }
  /**
   * The default condition for determining whether the boxend event
   * should fire.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent The originating MapBrowserEvent
   *     leading to the box end.
   * @param {import("../pixel.js").Pixel} startPixel The starting pixel of the box.
   * @param {import("../pixel.js").Pixel} endPixel The end pixel of the box.
   * @return {boolean} Whether or not the boxend condition should be fired.
   */
  defaultBoxEndCondition(t, e, i) {
    const s = i[0] - e[0], r = i[1] - e[1];
    return s * s + r * r >= this.minArea_;
  }
  /**
   * Returns geometry of last drawn box.
   * @return {import("../geom/Polygon.js").default} Geometry.
   * @api
   */
  getGeometry() {
    return this.box_.getGeometry();
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    this.startPixel_ && (this.box_.setPixels(this.startPixel_, t.pixel), this.dispatchEvent(
      new Gi(
        ni.BOXDRAG,
        t.coordinate,
        t
      )
    ));
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (!this.startPixel_)
      return !1;
    const e = this.boxEndCondition_(
      t,
      this.startPixel_,
      t.pixel
    );
    return e && this.onBoxEnd(t), this.dispatchEvent(
      new Gi(
        e ? ni.BOXEND : ni.BOXCANCEL,
        t.coordinate,
        t
      )
    ), this.box_.setMap(null), this.startPixel_ = null, !1;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    return this.condition_(t) ? (this.startPixel_ = t.pixel, this.box_.setMap(t.map), this.box_.setPixels(this.startPixel_, this.startPixel_), this.dispatchEvent(
      new Gi(
        ni.BOXSTART,
        t.coordinate,
        t
      )
    ), !0) : !1;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   */
  onBoxEnd(t) {
  }
  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   * @override
   */
  setActive(t) {
    t || (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new Gi(ni.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setActive(t);
  }
  /**
   * @param {import("../Map.js").default|null} map Map.
   * @override
   */
  setMap(t) {
    this.getMap() && (this.box_.setMap(null), this.startPixel_ && (this.dispatchEvent(
      new Gi(ni.BOXCANCEL, this.startPixel_, null)
    ), this.startPixel_ = null)), super.setMap(t);
  }
}
class Zc extends Vc {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.condition ? t.condition : tl;
    super({
      condition: e,
      className: t.className || "ol-dragzoom",
      minArea: t.minArea
    }), this.duration_ = t.duration !== void 0 ? t.duration : 200, this.out_ = t.out !== void 0 ? t.out : !1;
  }
  /**
   * Function to execute just before `onboxend` is fired
   * @param {import("../MapBrowserEvent.js").default} event Event.
   * @override
   */
  onBoxEnd(t) {
    const i = (
      /** @type {!import("../View.js").default} */
      this.getMap().getView()
    );
    let s = this.getGeometry();
    if (this.out_) {
      const r = i.rotatedExtentForGeometry(s), o = i.getResolutionForExtentInternal(r), a = i.getResolution() / o;
      s = s.clone(), s.scale(a * a);
    }
    i.fitInternal(s, {
      duration: this.duration_,
      easing: Ai
    });
  }
}
const Ne = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown"
};
class Uc extends Mi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.defaultCondition_ = function(e) {
      return Qa(e) && el(e);
    }, this.condition_ = t.condition !== void 0 ? t.condition : this.defaultCondition_, this.duration_ = t.duration !== void 0 ? t.duration : 100, this.pixelDelta_ = t.pixelDelta !== void 0 ? t.pixelDelta : 128;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides the direction to pan to (if an arrow key was
   * pressed).
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == z.KEYDOWN) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), s = i.key;
      if (this.condition_(t) && (s == Ne.DOWN || s == Ne.LEFT || s == Ne.RIGHT || s == Ne.UP)) {
        const o = t.map.getView(), a = o.getResolution() * this.pixelDelta_;
        let l = 0, c = 0;
        s == Ne.DOWN ? c = -a : s == Ne.LEFT ? l = -a : s == Ne.RIGHT ? l = a : c = a;
        const h = [l, c];
        yr(h, o.getRotation()), Fc(o, h, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class jc extends Mi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), t = t || {}, this.condition_ = t.condition ? t.condition : function(e) {
      return !Wc(e) && el(e);
    }, this.delta_ = t.delta ? t.delta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 100;
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} if it was a
   * `KeyEvent`, and decides whether to zoom in or out (depending on whether the
   * key pressed was '+' or '-').
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    let e = !1;
    if (t.type == z.KEYDOWN || t.type == z.KEYPRESS) {
      const i = (
        /** @type {KeyboardEvent} */
        t.originalEvent
      ), s = i.key;
      if (this.condition_(t) && (s === "+" || s === "-")) {
        const r = t.map, o = s === "+" ? this.delta_ : -this.delta_, a = r.getView();
        Nr(a, o, void 0, this.duration_), i.preventDefault(), e = !0;
      }
    }
    return !e;
  }
}
class Hc extends Mi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, super(
      /** @type {import("./Interaction.js").InteractionOptions} */
      t
    ), this.totalDelta_ = 0, this.lastDelta_ = 0, this.maxDelta_ = t.maxDelta !== void 0 ? t.maxDelta : 1, this.duration_ = t.duration !== void 0 ? t.duration : 250, this.timeout_ = t.timeout !== void 0 ? t.timeout : 80, this.useAnchor_ = t.useAnchor !== void 0 ? t.useAnchor : !0, this.constrainResolution_ = t.constrainResolution !== void 0 ? t.constrainResolution : !1;
    const e = t.condition ? t.condition : zc;
    this.condition_ = t.onFocusOnly ? lr($a, e) : e, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_, this.mode_ = void 0, this.trackpadEventGap_ = 400, this.trackpadTimeoutId_, this.deltaPerZoom_ = 300;
  }
  /**
   * @private
   */
  endInteraction_() {
    this.trackpadTimeoutId_ = void 0;
    const t = this.getMap();
    if (!t)
      return;
    t.getView().endInteraction(
      void 0,
      this.lastDelta_ ? this.lastDelta_ > 0 ? 1 : -1 : 0,
      this.lastAnchor_ ? t.getCoordinateFromPixel(this.lastAnchor_) : null
    );
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} (if it was a mousewheel-event) and eventually
   * zooms the map.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    if (!this.condition_(t) || t.type !== z.WHEEL)
      return !0;
    const i = t.map, s = (
      /** @type {WheelEvent} */
      t.originalEvent
    );
    s.preventDefault(), this.useAnchor_ && (this.lastAnchor_ = t.pixel);
    let r;
    if (t.type == z.WHEEL && (r = s.deltaY, s.deltaMode === WheelEvent.DOM_DELTA_LINE && (r *= 40)), r === 0)
      return !1;
    this.lastDelta_ = r;
    const o = Date.now();
    this.startTime_ === void 0 && (this.startTime_ = o), (!this.mode_ || o - this.startTime_ > this.trackpadEventGap_) && (this.mode_ = Math.abs(r) < 4 ? "trackpad" : "wheel");
    const a = i.getView();
    if (this.mode_ === "trackpad" && !(a.getConstrainResolution() || this.constrainResolution_))
      return this.trackpadTimeoutId_ ? clearTimeout(this.trackpadTimeoutId_) : (a.getAnimating() && a.cancelAnimations(), a.beginInteraction()), this.trackpadTimeoutId_ = setTimeout(
        this.endInteraction_.bind(this),
        this.timeout_
      ), a.adjustZoom(
        -r / this.deltaPerZoom_,
        this.lastAnchor_ ? i.getCoordinateFromPixel(this.lastAnchor_) : null
      ), this.startTime_ = o, !1;
    this.totalDelta_ += r;
    const l = Math.max(this.timeout_ - (o - this.startTime_), 0);
    return clearTimeout(this.timeoutId_), this.timeoutId_ = setTimeout(
      this.handleWheelZoom_.bind(this, i),
      l
    ), !1;
  }
  /**
   * @private
   * @param {import("../Map.js").default} map Map.
   */
  handleWheelZoom_(t) {
    const e = t.getView();
    e.getAnimating() && e.cancelAnimations();
    let i = -it(
      this.totalDelta_,
      -this.maxDelta_ * this.deltaPerZoom_,
      this.maxDelta_ * this.deltaPerZoom_
    ) / this.deltaPerZoom_;
    (e.getConstrainResolution() || this.constrainResolution_) && (i = i ? i > 0 ? 1 : -1 : 0), Nr(
      e,
      i,
      this.lastAnchor_ ? t.getCoordinateFromPixel(this.lastAnchor_) : null,
      this.duration_
    ), this.mode_ = void 0, this.totalDelta_ = 0, this.lastAnchor_ = null, this.startTime_ = void 0, this.timeoutId_ = void 0;
  }
  /**
   * Enable or disable using the mouse's location as an anchor when zooming
   * @param {boolean} useAnchor true to zoom to the mouse's location, false
   * to zoom to the center of the map
   * @api
   */
  setMouseAnchor(t) {
    this.useAnchor_ = t, t || (this.lastAnchor_ = null);
  }
}
class $c extends mn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = fn), super(e), this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.threshold_ = t.threshold !== void 0 ? t.threshold : 0.3, this.duration_ = t.duration !== void 0 ? t.duration : 250;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 0;
    const i = this.targetPointers[0], s = this.targetPointers[1], r = Math.atan2(
      s.clientY - i.clientY,
      s.clientX - i.clientX
    );
    if (this.lastAngle_ !== void 0) {
      const l = r - this.lastAngle_;
      this.rotationDelta_ += l, !this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_ && (this.rotating_ = !0), e = l;
    }
    this.lastAngle_ = r;
    const o = t.map, a = o.getView();
    a.getConstraints().rotation !== Or && (this.anchor_ = o.getCoordinateFromPixelInternal(
      o.getEventPixel(Gr(this.targetPointers))
    ), this.rotating_ && (o.render(), a.adjustRotationInternal(e, this.anchor_)));
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    return this.targetPointers.length < 2 ? (t.map.getView().endInteraction(this.duration_), !1) : !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return this.anchor_ = null, this.lastAngle_ = void 0, this.rotating_ = !1, this.rotationDelta_ = 0, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
class qc extends mn {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {import("./Pointer.js").Options} */
      t
    );
    e.stopDown || (e.stopDown = fn), super(e), this.anchor_ = null, this.duration_ = t.duration !== void 0 ? t.duration : 400, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1;
  }
  /**
   * Handle pointer drag events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @override
   */
  handleDragEvent(t) {
    let e = 1;
    const i = this.targetPointers[0], s = this.targetPointers[1], r = i.clientX - s.clientX, o = i.clientY - s.clientY, a = Math.sqrt(r * r + o * o);
    this.lastDistance_ !== void 0 && (e = this.lastDistance_ / a), this.lastDistance_ = a;
    const l = t.map, c = l.getView();
    e != 1 && (this.lastScaleDelta_ = e), this.anchor_ = l.getCoordinateFromPixelInternal(
      l.getEventPixel(Gr(this.targetPointers))
    ), l.render(), c.adjustResolutionInternal(e, this.anchor_);
  }
  /**
   * Handle pointer up events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleUpEvent(t) {
    if (this.targetPointers.length < 2) {
      const i = t.map.getView(), s = this.lastScaleDelta_ > 1 ? 1 : -1;
      return i.endInteraction(this.duration_, s), !1;
    }
    return !0;
  }
  /**
   * Handle pointer down events.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Event.
   * @return {boolean} If the event was consumed.
   * @override
   */
  handleDownEvent(t) {
    if (this.targetPointers.length >= 2) {
      const e = t.map;
      return this.anchor_ = null, this.lastDistance_ = void 0, this.lastScaleDelta_ = 1, this.handlingDownUpSequence || e.getView().beginInteraction(), !0;
    }
    return !1;
  }
}
function Jc(n) {
  n = n || {};
  const t = new Ut(), e = new Dc(-5e-3, 0.05, 100);
  return (n.altShiftDragRotate !== void 0 ? n.altShiftDragRotate : !0) && t.push(new Kc()), (n.doubleClickZoom !== void 0 ? n.doubleClickZoom : !0) && t.push(
    new kc({
      delta: n.zoomDelta,
      duration: n.zoomDuration
    })
  ), (n.dragPan !== void 0 ? n.dragPan : !0) && t.push(
    new Yc({
      onFocusOnly: n.onFocusOnly,
      kinetic: e
    })
  ), (n.pinchRotate !== void 0 ? n.pinchRotate : !0) && t.push(new $c()), (n.pinchZoom !== void 0 ? n.pinchZoom : !0) && t.push(
    new qc({
      duration: n.zoomDuration
    })
  ), (n.keyboard !== void 0 ? n.keyboard : !0) && (t.push(new Uc()), t.push(
    new jc({
      delta: n.zoomDelta,
      duration: n.zoomDuration
    })
  )), (n.mouseWheelZoom !== void 0 ? n.mouseWheelZoom : !0) && t.push(
    new Hc({
      onFocusOnly: n.onFocusOnly,
      duration: n.zoomDuration
    })
  ), (n.shiftDragZoom !== void 0 ? n.shiftDragZoom : !0) && t.push(
    new Zc({
      duration: n.zoomDuration
    })
  ), t;
}
const q = {
  OPACITY: "opacity",
  VISIBLE: "visible",
  EXTENT: "extent",
  Z_INDEX: "zIndex",
  MAX_RESOLUTION: "maxResolution",
  MIN_RESOLUTION: "minResolution",
  MAX_ZOOM: "maxZoom",
  MIN_ZOOM: "minZoom",
  SOURCE: "source",
  MAP: "map"
};
class il extends $t {
  /**
   * @param {Options} options Layer options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.background_ = t.background;
    const e = Object.assign({}, t);
    typeof t.properties == "object" && (delete e.properties, Object.assign(e, t.properties)), e[q.OPACITY] = t.opacity !== void 0 ? t.opacity : 1, $(
      typeof e[q.OPACITY] == "number",
      "Layer opacity must be a number"
    ), e[q.VISIBLE] = t.visible !== void 0 ? t.visible : !0, e[q.Z_INDEX] = t.zIndex, e[q.MAX_RESOLUTION] = t.maxResolution !== void 0 ? t.maxResolution : 1 / 0, e[q.MIN_RESOLUTION] = t.minResolution !== void 0 ? t.minResolution : 0, e[q.MIN_ZOOM] = t.minZoom !== void 0 ? t.minZoom : -1 / 0, e[q.MAX_ZOOM] = t.maxZoom !== void 0 ? t.maxZoom : 1 / 0, this.className_ = e.className !== void 0 ? e.className : "ol-layer", delete e.className, this.setProperties(e), this.state_ = null;
  }
  /**
   * Get the background for this layer.
   * @return {BackgroundColor|false} Layer background.
   */
  getBackground() {
    return this.background_;
  }
  /**
   * @return {string} CSS class name.
   */
  getClassName() {
    return this.className_;
  }
  /**
   * This method is not meant to be called by layers or layer renderers because the state
   * is incorrect if the layer is included in a layer group.
   *
   * @param {boolean} [managed] Layer is managed.
   * @return {import("./Layer.js").State} Layer state.
   */
  getLayerState(t) {
    const e = this.state_ || /** @type {?} */
    {
      layer: this,
      managed: t === void 0 ? !0 : t
    }, i = this.getZIndex();
    return e.opacity = it(Math.round(this.getOpacity() * 100) / 100, 0, 1), e.visible = this.getVisible(), e.extent = this.getExtent(), e.zIndex = i === void 0 && !e.managed ? 1 / 0 : i, e.maxResolution = this.getMaxResolution(), e.minResolution = Math.max(this.getMinResolution(), 0), e.minZoom = this.getMinZoom(), e.maxZoom = this.getMaxZoom(), this.state_ = e, e;
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  getLayersArray(t) {
    return j();
  }
  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  getLayerStatesArray(t) {
    return j();
  }
  /**
   * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
   * will be visible regardless of extent.
   * @return {import("../extent.js").Extent|undefined} The layer extent.
   * @observable
   * @api
   */
  getExtent() {
    return (
      /** @type {import("../extent.js").Extent|undefined} */
      this.get(q.EXTENT)
    );
  }
  /**
   * Return the maximum resolution of the layer. Returns Infinity if
   * the layer has no maximum resolution set.
   * @return {number} The maximum resolution of the layer.
   * @observable
   * @api
   */
  getMaxResolution() {
    return (
      /** @type {number} */
      this.get(q.MAX_RESOLUTION)
    );
  }
  /**
   * Return the minimum resolution of the layer. Returns 0 if
   * the layer has no minimum resolution set.
   * @return {number} The minimum resolution of the layer.
   * @observable
   * @api
   */
  getMinResolution() {
    return (
      /** @type {number} */
      this.get(q.MIN_RESOLUTION)
    );
  }
  /**
   * Return the minimum zoom level of the layer. Returns -Infinity if
   * the layer has no minimum zoom set.
   * @return {number} The minimum zoom level of the layer.
   * @observable
   * @api
   */
  getMinZoom() {
    return (
      /** @type {number} */
      this.get(q.MIN_ZOOM)
    );
  }
  /**
   * Return the maximum zoom level of the layer. Returns Infinity if
   * the layer has no maximum zoom set.
   * @return {number} The maximum zoom level of the layer.
   * @observable
   * @api
   */
  getMaxZoom() {
    return (
      /** @type {number} */
      this.get(q.MAX_ZOOM)
    );
  }
  /**
   * Return the opacity of the layer (between 0 and 1).
   * @return {number} The opacity of the layer.
   * @observable
   * @api
   */
  getOpacity() {
    return (
      /** @type {number} */
      this.get(q.OPACITY)
    );
  }
  /**
   * @abstract
   * @return {import("../source/Source.js").State} Source state.
   */
  getSourceState() {
    return j();
  }
  /**
   * Return the value of this layer's `visible` property. To find out whether the layer
   * is visible on a map, use `isVisible()` instead.
   * @return {boolean} The value of the `visible` property of the layer.
   * @observable
   * @api
   */
  getVisible() {
    return (
      /** @type {boolean} */
      this.get(q.VISIBLE)
    );
  }
  /**
   * Return the Z-index of the layer, which is used to order layers before
   * rendering. Returns undefined if the layer is unmanaged.
   * @return {number|undefined} The Z-index of the layer.
   * @observable
   * @api
   */
  getZIndex() {
    return (
      /** @type {number|undefined} */
      this.get(q.Z_INDEX)
    );
  }
  /**
   * Sets the background color.
   * @param {BackgroundColor} [background] Background color.
   */
  setBackground(t) {
    this.background_ = t, this.changed();
  }
  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
   * @observable
   * @api
   */
  setExtent(t) {
    this.set(q.EXTENT, t);
  }
  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  setMaxResolution(t) {
    this.set(q.MAX_RESOLUTION, t);
  }
  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  setMinResolution(t) {
    this.set(q.MIN_RESOLUTION, t);
  }
  /**
   * Set the maximum zoom (exclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} maxZoom The maximum zoom of the layer.
   * @observable
   * @api
   */
  setMaxZoom(t) {
    this.set(q.MAX_ZOOM, t);
  }
  /**
   * Set the minimum zoom (inclusive) at which the layer is visible.
   * Note that the zoom levels for layer visibility are based on the
   * view zoom level, which may be different from a tile source zoom level.
   * @param {number} minZoom The minimum zoom of the layer.
   * @observable
   * @api
   */
  setMinZoom(t) {
    this.set(q.MIN_ZOOM, t);
  }
  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  setOpacity(t) {
    $(typeof t == "number", "Layer opacity must be a number"), this.set(q.OPACITY, t);
  }
  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  setVisible(t) {
    this.set(q.VISIBLE, t);
  }
  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  setZIndex(t) {
    this.set(q.Z_INDEX, t);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.state_ && (this.state_.layer = null, this.state_ = null), super.disposeInternal();
  }
}
class Ie extends se {
  /**
   * @param {GroupEventType} type The event type.
   * @param {BaseLayer} layer The layer.
   */
  constructor(t, e) {
    super(t), this.layer = e;
  }
}
const Ps = {
  LAYERS: "layers"
};
class bi extends il {
  /**
   * @param {Options} [options] Layer options.
   */
  constructor(t) {
    t = t || {};
    const e = (
      /** @type {Options} */
      Object.assign({}, t)
    );
    delete e.layers;
    let i = t.layers;
    super(e), this.on, this.once, this.un, this.layersListenerKeys_ = [], this.listenerKeys_ = {}, this.addChangeListener(Ps.LAYERS, this.handleLayersChanged_), i ? Array.isArray(i) ? i = new Ut(i.slice(), { unique: !0 }) : $(
      typeof /** @type {?} */
      i.getArray == "function",
      "Expected `layers` to be an array or a `Collection`"
    ) : i = new Ut(void 0, { unique: !0 }), this.setLayers(i);
  }
  /**
   * @private
   */
  handleLayerChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleLayersChanged_() {
    this.layersListenerKeys_.forEach(tt), this.layersListenerKeys_.length = 0;
    const t = this.getLayers();
    this.layersListenerKeys_.push(
      U(t, ft.ADD, this.handleLayersAdd_, this),
      U(
        t,
        ft.REMOVE,
        this.handleLayersRemove_,
        this
      )
    );
    for (const i in this.listenerKeys_)
      this.listenerKeys_[i].forEach(tt);
    Li(this.listenerKeys_);
    const e = t.getArray();
    for (let i = 0, s = e.length; i < s; i++) {
      const r = e[i];
      this.registerLayerListeners_(r), this.dispatchEvent(new Ie("addlayer", r));
    }
    this.changed();
  }
  /**
   * @param {BaseLayer} layer The layer.
   */
  registerLayerListeners_(t) {
    const e = [
      U(
        t,
        wi.PROPERTYCHANGE,
        this.handleLayerChange_,
        this
      ),
      U(t, z.CHANGE, this.handleLayerChange_, this)
    ];
    t instanceof bi && e.push(
      U(t, "addlayer", this.handleLayerGroupAdd_, this),
      U(t, "removelayer", this.handleLayerGroupRemove_, this)
    ), this.listenerKeys_[B(t)] = e;
  }
  /**
   * @param {GroupEvent} event The layer group event.
   */
  handleLayerGroupAdd_(t) {
    this.dispatchEvent(new Ie("addlayer", t.layer));
  }
  /**
   * @param {GroupEvent} event The layer group event.
   */
  handleLayerGroupRemove_(t) {
    this.dispatchEvent(new Ie("removelayer", t.layer));
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<import("./Base.js").default>} collectionEvent CollectionEvent.
   * @private
   */
  handleLayersAdd_(t) {
    const e = t.element;
    this.registerLayerListeners_(e), this.dispatchEvent(new Ie("addlayer", e)), this.changed();
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<import("./Base.js").default>} collectionEvent CollectionEvent.
   * @private
   */
  handleLayersRemove_(t) {
    const e = t.element, i = B(e);
    this.listenerKeys_[i].forEach(tt), delete this.listenerKeys_[i], this.dispatchEvent(new Ie("removelayer", e)), this.changed();
  }
  /**
   * Returns the {@link module:ol/Collection~Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @return {!Collection<import("./Base.js").default>} Collection of
   *   {@link module:ol/layer/Base~BaseLayer layers} that are part of this group.
   * @observable
   * @api
   */
  getLayers() {
    return (
      /** @type {!Collection<import("./Base.js").default>} */
      this.get(Ps.LAYERS)
    );
  }
  /**
   * Set the {@link module:ol/Collection~Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @param {!Collection<import("./Base.js").default>} layers Collection of
   *   {@link module:ol/layer/Base~BaseLayer layers} that are part of this group.
   * @observable
   * @api
   */
  setLayers(t) {
    const e = this.getLayers();
    if (e) {
      const i = e.getArray();
      for (let s = 0, r = i.length; s < r; ++s)
        this.dispatchEvent(new Ie("removelayer", i[s]));
    }
    this.set(Ps.LAYERS, t);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   * @override
   */
  getLayersArray(t) {
    return t = t !== void 0 ? t : [], this.getLayers().forEach(function(e) {
      e.getLayersArray(t);
    }), t;
  }
  /**
   * Get the layer states list and use this groups z-index as the default
   * for all layers in this and nested groups, if it is unset at this point.
   * If dest is not provided and this group's z-index is undefined
   * 0 is used a the default z-index.
   * @param {Array<import("./Layer.js").State>} [dest] Optional list
   * of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   * @override
   */
  getLayerStatesArray(t) {
    const e = t !== void 0 ? t : [], i = e.length;
    this.getLayers().forEach(function(o) {
      o.getLayerStatesArray(e);
    });
    const s = this.getLayerState();
    let r = s.zIndex;
    !t && s.zIndex === void 0 && (r = 0);
    for (let o = i, a = e.length; o < a; o++) {
      const l = e[o];
      l.opacity *= s.opacity, l.visible = l.visible && s.visible, l.maxResolution = Math.min(
        l.maxResolution,
        s.maxResolution
      ), l.minResolution = Math.max(
        l.minResolution,
        s.minResolution
      ), l.minZoom = Math.max(l.minZoom, s.minZoom), l.maxZoom = Math.min(l.maxZoom, s.maxZoom), s.extent !== void 0 && (l.extent !== void 0 ? l.extent = Ve(
        l.extent,
        s.extent
      ) : l.extent = s.extent), l.zIndex === void 0 && (l.zIndex = r);
    }
    return e;
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   * @override
   */
  getSourceState() {
    return "ready";
  }
}
const Gt = {
  /**
   * Triggered before a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#prerender
   * @api
   */
  PRERENDER: "prerender",
  /**
   * Triggered after a layer is rendered.
   * @event module:ol/render/Event~RenderEvent#postrender
   * @api
   */
  POSTRENDER: "postrender",
  /**
   * Triggered before layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#precompose
   * @api
   */
  PRECOMPOSE: "precompose",
  /**
   * Triggered after layers are composed.  When dispatched by the map, the event object will not have
   * a `context` set.  When dispatched by a layer, the event object will have a `context` set.  Only
   * WebGL layers currently dispatch this event.
   * @event module:ol/render/Event~RenderEvent#postcompose
   * @api
   */
  POSTCOMPOSE: "postcompose",
  /**
   * Triggered when rendering is complete, i.e. all sources and tiles have
   * finished loading for the current viewport, and all tiles are faded in.
   * The event object will not have a `context` set.
   * @event module:ol/render/Event~RenderEvent#rendercomplete
   * @api
   */
  RENDERCOMPLETE: "rendercomplete"
};
class gs extends il {
  /**
   * @param {Options<SourceType>} options Layer options.
   */
  constructor(t) {
    const e = Object.assign({}, t);
    delete e.source, super(e), this.on, this.once, this.un, this.mapPrecomposeKey_ = null, this.mapRenderKey_ = null, this.sourceChangeKey_ = null, this.renderer_ = null, this.sourceReady_ = !1, this.rendered = !1, t.render && (this.render = t.render), t.map && this.setMap(t.map), this.addChangeListener(
      q.SOURCE,
      this.handleSourcePropertyChange_
    );
    const i = t.source ? (
      /** @type {SourceType} */
      t.source
    ) : null;
    this.setSource(i);
  }
  /**
   * @param {Array<import("./Layer.js").default>} [array] Array of layers (to be modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   * @override
   */
  getLayersArray(t) {
    return t = t || [], t.push(this), t;
  }
  /**
   * @param {Array<import("./Layer.js").State>} [states] Optional list of layer states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   * @override
   */
  getLayerStatesArray(t) {
    return t = t || [], t.push(this.getLayerState()), t;
  }
  /**
   * Get the layer source.
   * @return {SourceType|null} The layer source (or `null` if not yet set).
   * @observable
   * @api
   */
  getSource() {
    return (
      /** @type {SourceType} */
      this.get(q.SOURCE) || null
    );
  }
  /**
   * @return {SourceType|null} The source being rendered.
   */
  getRenderSource() {
    return this.getSource();
  }
  /**
   * @return {import("../source/Source.js").State} Source state.
   * @override
   */
  getSourceState() {
    const t = this.getSource();
    return t ? t.getState() : "undefined";
  }
  /**
   * @private
   */
  handleSourceChange_() {
    this.changed(), !(this.sourceReady_ || this.getSource().getState() !== "ready") && (this.sourceReady_ = !0, this.dispatchEvent("sourceready"));
  }
  /**
   * @private
   */
  handleSourcePropertyChange_() {
    this.sourceChangeKey_ && (tt(this.sourceChangeKey_), this.sourceChangeKey_ = null), this.sourceReady_ = !1;
    const t = this.getSource();
    t && (this.sourceChangeKey_ = U(
      t,
      z.CHANGE,
      this.handleSourceChange_,
      this
    ), t.getState() === "ready" && (this.sourceReady_ = !0, setTimeout(() => {
      this.dispatchEvent("sourceready");
    }, 0)), this.clearRenderer()), this.changed();
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return this.renderer_ ? this.renderer_.getFeatures(t) : Promise.resolve([]);
  }
  /**
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return !this.renderer_ || !this.rendered ? null : this.renderer_.getData(t);
  }
  /**
   * The layer is visible on the map view, i.e. within its min/max resolution or zoom and
   * extent, not set to `visible: false`, and not inside a layer group that is set
   * to `visible: false`.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {boolean} The layer is visible in the map view.
   * @api
   */
  isVisible(t) {
    let e;
    const i = this.getMapInternal();
    !t && i && (t = i.getView()), t instanceof ee ? e = {
      viewState: t.getState(),
      extent: t.calculateExtent()
    } : e = t, !e.layerStatesArray && i && (e.layerStatesArray = i.getLayerGroup().getLayerStatesArray());
    let s;
    if (e.layerStatesArray) {
      if (s = e.layerStatesArray.find(
        (o) => o.layer === this
      ), !s)
        return !1;
    } else
      s = this.getLayerState();
    const r = this.getExtent();
    return zr(s, e.viewState) && (!r || It(r, e.extent));
  }
  /**
   * Get the attributions of the source of this layer for the given view.
   * @param {View|import("../View.js").ViewStateLayerStateExtent} [view] View or {@link import("../Map.js").FrameState}.
   * Only required when the layer is not added to a map.
   * @return {Array<string>} Attributions for this layer at the given view.
   * @api
   */
  getAttributions(t) {
    if (!this.isVisible(t))
      return [];
    const e = this.getSource()?.getAttributions();
    if (!e)
      return [];
    const i = t instanceof ee ? t.getViewStateAndExtent() : t;
    let s = e(i);
    return Array.isArray(s) || (s = [s]), s;
  }
  /**
   * In charge to manage the rendering of the layer. One layer type is
   * bounded with one layer renderer.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target which the renderer may (but need not) use
   * for rendering its content.
   * @return {HTMLElement|null} The rendered element.
   */
  render(t, e) {
    const i = this.getRenderer();
    return i.prepareFrame(t) ? (this.rendered = !0, i.renderFrame(t, e)) : null;
  }
  /**
   * Called when a layer is not visible during a map render.
   */
  unrender() {
    this.rendered = !1;
  }
  /** @return {string} Declutter */
  getDeclutter() {
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   */
  renderDeclutter(t, e) {
  }
  /**
   * When the renderer follows a layout -> render approach, do the final rendering here.
   * @param {import('../Map.js').FrameState} frameState Frame state
   */
  renderDeferred(t) {
    const e = this.getRenderer();
    e && e.renderDeferred(t);
  }
  /**
   * For use inside the library only.
   * @param {import("../Map.js").default|null} map Map.
   */
  setMapInternal(t) {
    t || this.unrender(), this.set(q.MAP, t);
  }
  /**
   * For use inside the library only.
   * @return {import("../Map.js").default|null} Map.
   */
  getMapInternal() {
    return this.get(q.MAP);
  }
  /**
   * Sets the layer to be rendered on top of other layers on a map. The map will
   * not manage this layer in its layers collection. This
   * is useful for temporary layers. To remove an unmanaged layer from the map,
   * use `#setMap(null)`.
   *
   * To add the layer to a map and have it managed by the map, use
   * {@link module:ol/Map~Map#addLayer} instead.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   */
  setMap(t) {
    this.mapPrecomposeKey_ && (tt(this.mapPrecomposeKey_), this.mapPrecomposeKey_ = null), t || this.changed(), this.mapRenderKey_ && (tt(this.mapRenderKey_), this.mapRenderKey_ = null), t && (this.mapPrecomposeKey_ = U(
      t,
      Gt.PRECOMPOSE,
      this.handlePrecompose_,
      this
    ), this.mapRenderKey_ = U(this, z.CHANGE, t.render, t), this.changed());
  }
  /**
   * @param {import("../events/Event.js").default} renderEvent Render event
   * @private
   */
  handlePrecompose_(t) {
    const e = (
      /** @type {import("../render/Event.js").default} */
      t.frameState.layerStatesArray
    ), i = this.getLayerState(!1);
    $(
      !e.some(
        (s) => s.layer === i.layer
      ),
      "A layer can only be added to the map once. Use either `layer.setMap()` or `map.addLayer()`, not both."
    ), e.push(i);
  }
  /**
   * Set the layer source.
   * @param {SourceType|null} source The layer source.
   * @observable
   * @api
   */
  setSource(t) {
    this.set(q.SOURCE, t);
  }
  /**
   * Get the renderer for this layer.
   * @return {RendererType|null} The layer renderer.
   */
  getRenderer() {
    return this.renderer_ || (this.renderer_ = this.createRenderer()), this.renderer_;
  }
  /**
   * @return {boolean} The layer has a renderer.
   */
  hasRenderer() {
    return !!this.renderer_;
  }
  /**
   * Create a renderer for this layer.
   * @return {RendererType} A layer renderer.
   * @protected
   */
  createRenderer() {
    return null;
  }
  /**
   * This will clear the renderer so that a new one can be created next time it is needed
   */
  clearRenderer() {
    this.renderer_ && (this.renderer_.dispose(), delete this.renderer_);
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.clearRenderer(), this.setSource(null), super.disposeInternal();
  }
}
function zr(n, t) {
  if (!n.visible)
    return !1;
  const e = t.resolution;
  if (e < n.minResolution || e >= n.maxResolution)
    return !1;
  const i = t.zoom;
  return i > n.minZoom && i <= n.maxZoom;
}
function Qc(n, t, e, i, s) {
  nl(n, t, e || 0, i || n.length - 1, s || tu);
}
function nl(n, t, e, i, s) {
  for (; i > e; ) {
    if (i - e > 600) {
      var r = i - e + 1, o = t - e + 1, a = Math.log(r), l = 0.5 * Math.exp(2 * a / 3), c = 0.5 * Math.sqrt(a * l * (r - l) / r) * (o - r / 2 < 0 ? -1 : 1), h = Math.max(e, Math.floor(t - o * l / r + c)), u = Math.min(i, Math.floor(t + (r - o) * l / r + c));
      nl(n, t, h, u, s);
    }
    var d = n[t], f = e, g = i;
    for (zi(n, e, t), s(n[i], d) > 0 && zi(n, e, i); f < g; ) {
      for (zi(n, f, g), f++, g--; s(n[f], d) < 0; ) f++;
      for (; s(n[g], d) > 0; ) g--;
    }
    s(n[e], d) === 0 ? zi(n, e, g) : (g++, zi(n, g, i)), g <= t && (e = g + 1), t <= g && (i = g - 1);
  }
}
function zi(n, t, e) {
  var i = n[t];
  n[t] = n[e], n[e] = i;
}
function tu(n, t) {
  return n < t ? -1 : n > t ? 1 : 0;
}
let sl = class {
  constructor(t = 9) {
    this._maxEntries = Math.max(4, t), this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4)), this.clear();
  }
  all() {
    return this._all(this.data, []);
  }
  search(t) {
    let e = this.data;
    const i = [];
    if (!An(t, e)) return i;
    const s = this.toBBox, r = [];
    for (; e; ) {
      for (let o = 0; o < e.children.length; o++) {
        const a = e.children[o], l = e.leaf ? s(a) : a;
        An(t, l) && (e.leaf ? i.push(a) : Ds(t, l) ? this._all(a, i) : r.push(a));
      }
      e = r.pop();
    }
    return i;
  }
  collides(t) {
    let e = this.data;
    if (!An(t, e)) return !1;
    const i = [];
    for (; e; ) {
      for (let s = 0; s < e.children.length; s++) {
        const r = e.children[s], o = e.leaf ? this.toBBox(r) : r;
        if (An(t, o)) {
          if (e.leaf || Ds(t, o)) return !0;
          i.push(r);
        }
      }
      e = i.pop();
    }
    return !1;
  }
  load(t) {
    if (!(t && t.length)) return this;
    if (t.length < this._minEntries) {
      for (let i = 0; i < t.length; i++)
        this.insert(t[i]);
      return this;
    }
    let e = this._build(t.slice(), 0, t.length - 1, 0);
    if (!this.data.children.length)
      this.data = e;
    else if (this.data.height === e.height)
      this._splitRoot(this.data, e);
    else {
      if (this.data.height < e.height) {
        const i = this.data;
        this.data = e, e = i;
      }
      this._insert(e, this.data.height - e.height - 1, !0);
    }
    return this;
  }
  insert(t) {
    return t && this._insert(t, this.data.height - 1), this;
  }
  clear() {
    return this.data = ci([]), this;
  }
  remove(t, e) {
    if (!t) return this;
    let i = this.data;
    const s = this.toBBox(t), r = [], o = [];
    let a, l, c;
    for (; i || r.length; ) {
      if (i || (i = r.pop(), l = r[r.length - 1], a = o.pop(), c = !0), i.leaf) {
        const h = eu(t, i.children, e);
        if (h !== -1)
          return i.children.splice(h, 1), r.push(i), this._condense(r), this;
      }
      !c && !i.leaf && Ds(i, s) ? (r.push(i), o.push(a), a = 0, l = i, i = i.children[0]) : l ? (a++, i = l.children[a], c = !1) : i = null;
    }
    return this;
  }
  toBBox(t) {
    return t;
  }
  compareMinX(t, e) {
    return t.minX - e.minX;
  }
  compareMinY(t, e) {
    return t.minY - e.minY;
  }
  toJSON() {
    return this.data;
  }
  fromJSON(t) {
    return this.data = t, this;
  }
  _all(t, e) {
    const i = [];
    for (; t; )
      t.leaf ? e.push(...t.children) : i.push(...t.children), t = i.pop();
    return e;
  }
  _build(t, e, i, s) {
    const r = i - e + 1;
    let o = this._maxEntries, a;
    if (r <= o)
      return a = ci(t.slice(e, i + 1)), si(a, this.toBBox), a;
    s || (s = Math.ceil(Math.log(r) / Math.log(o)), o = Math.ceil(r / Math.pow(o, s - 1))), a = ci([]), a.leaf = !1, a.height = s;
    const l = Math.ceil(r / o), c = l * Math.ceil(Math.sqrt(o));
    Do(t, e, i, c, this.compareMinX);
    for (let h = e; h <= i; h += c) {
      const u = Math.min(h + c - 1, i);
      Do(t, h, u, l, this.compareMinY);
      for (let d = h; d <= u; d += l) {
        const f = Math.min(d + l - 1, u);
        a.children.push(this._build(t, d, f, s - 1));
      }
    }
    return si(a, this.toBBox), a;
  }
  _chooseSubtree(t, e, i, s) {
    for (; s.push(e), !(e.leaf || s.length - 1 === i); ) {
      let r = 1 / 0, o = 1 / 0, a;
      for (let l = 0; l < e.children.length; l++) {
        const c = e.children[l], h = Os(c), u = su(t, c) - h;
        u < o ? (o = u, r = h < r ? h : r, a = c) : u === o && h < r && (r = h, a = c);
      }
      e = a || e.children[0];
    }
    return e;
  }
  _insert(t, e, i) {
    const s = i ? t : this.toBBox(t), r = [], o = this._chooseSubtree(s, this.data, e, r);
    for (o.children.push(t), Ki(o, s); e >= 0 && r[e].children.length > this._maxEntries; )
      this._split(r, e), e--;
    this._adjustParentBBoxes(s, r, e);
  }
  // split overflowed node into two
  _split(t, e) {
    const i = t[e], s = i.children.length, r = this._minEntries;
    this._chooseSplitAxis(i, r, s);
    const o = this._chooseSplitIndex(i, r, s), a = ci(i.children.splice(o, i.children.length - o));
    a.height = i.height, a.leaf = i.leaf, si(i, this.toBBox), si(a, this.toBBox), e ? t[e - 1].children.push(a) : this._splitRoot(i, a);
  }
  _splitRoot(t, e) {
    this.data = ci([t, e]), this.data.height = t.height + 1, this.data.leaf = !1, si(this.data, this.toBBox);
  }
  _chooseSplitIndex(t, e, i) {
    let s, r = 1 / 0, o = 1 / 0;
    for (let a = e; a <= i - e; a++) {
      const l = Yi(t, 0, a, this.toBBox), c = Yi(t, a, i, this.toBBox), h = ru(l, c), u = Os(l) + Os(c);
      h < r ? (r = h, s = a, o = u < o ? u : o) : h === r && u < o && (o = u, s = a);
    }
    return s || i - e;
  }
  // sorts node children by the best axis for split
  _chooseSplitAxis(t, e, i) {
    const s = t.leaf ? this.compareMinX : iu, r = t.leaf ? this.compareMinY : nu, o = this._allDistMargin(t, e, i, s), a = this._allDistMargin(t, e, i, r);
    o < a && t.children.sort(s);
  }
  // total margin of all possible split distributions where each node is at least m full
  _allDistMargin(t, e, i, s) {
    t.children.sort(s);
    const r = this.toBBox, o = Yi(t, 0, e, r), a = Yi(t, i - e, i, r);
    let l = Ln(o) + Ln(a);
    for (let c = e; c < i - e; c++) {
      const h = t.children[c];
      Ki(o, t.leaf ? r(h) : h), l += Ln(o);
    }
    for (let c = i - e - 1; c >= e; c--) {
      const h = t.children[c];
      Ki(a, t.leaf ? r(h) : h), l += Ln(a);
    }
    return l;
  }
  _adjustParentBBoxes(t, e, i) {
    for (let s = i; s >= 0; s--)
      Ki(e[s], t);
  }
  _condense(t) {
    for (let e = t.length - 1, i; e >= 0; e--)
      t[e].children.length === 0 ? e > 0 ? (i = t[e - 1].children, i.splice(i.indexOf(t[e]), 1)) : this.clear() : si(t[e], this.toBBox);
  }
};
function eu(n, t, e) {
  if (!e) return t.indexOf(n);
  for (let i = 0; i < t.length; i++)
    if (e(n, t[i])) return i;
  return -1;
}
function si(n, t) {
  Yi(n, 0, n.children.length, t, n);
}
function Yi(n, t, e, i, s) {
  s || (s = ci(null)), s.minX = 1 / 0, s.minY = 1 / 0, s.maxX = -1 / 0, s.maxY = -1 / 0;
  for (let r = t; r < e; r++) {
    const o = n.children[r];
    Ki(s, n.leaf ? i(o) : o);
  }
  return s;
}
function Ki(n, t) {
  return n.minX = Math.min(n.minX, t.minX), n.minY = Math.min(n.minY, t.minY), n.maxX = Math.max(n.maxX, t.maxX), n.maxY = Math.max(n.maxY, t.maxY), n;
}
function iu(n, t) {
  return n.minX - t.minX;
}
function nu(n, t) {
  return n.minY - t.minY;
}
function Os(n) {
  return (n.maxX - n.minX) * (n.maxY - n.minY);
}
function Ln(n) {
  return n.maxX - n.minX + (n.maxY - n.minY);
}
function su(n, t) {
  return (Math.max(t.maxX, n.maxX) - Math.min(t.minX, n.minX)) * (Math.max(t.maxY, n.maxY) - Math.min(t.minY, n.minY));
}
function ru(n, t) {
  const e = Math.max(n.minX, t.minX), i = Math.max(n.minY, t.minY), s = Math.min(n.maxX, t.maxX), r = Math.min(n.maxY, t.maxY);
  return Math.max(0, s - e) * Math.max(0, r - i);
}
function Ds(n, t) {
  return n.minX <= t.minX && n.minY <= t.minY && t.maxX <= n.maxX && t.maxY <= n.maxY;
}
function An(n, t) {
  return t.minX <= n.maxX && t.minY <= n.maxY && t.maxX >= n.minX && t.maxY >= n.minY;
}
function ci(n) {
  return {
    children: n,
    height: 1,
    leaf: !0,
    minX: 1 / 0,
    minY: 1 / 0,
    maxX: -1 / 0,
    maxY: -1 / 0
  };
}
function Do(n, t, e, i, s) {
  const r = [t, e];
  for (; r.length; ) {
    if (e = r.pop(), t = r.pop(), e - t <= i) continue;
    const o = t + Math.ceil((e - t) / i / 2) * i;
    Qc(n, o, t, e, s), r.push(t, o, o, e);
  }
}
const Wr = [NaN, NaN, NaN, 0];
let Fs;
function ou() {
  return Fs || (Fs = at(1, 1, void 0, {
    willReadFrequently: !0,
    desynchronized: !0
  })), Fs;
}
const au = /^rgba?\(\s*(\d+%?)\s+(\d+%?)\s+(\d+%?)(?:\s*\/\s*(\d+%|\d*\.\d+|[01]))?\s*\)$/i, lu = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+%|\d*\.\d+|[01]))?\s*\)$/i, hu = /^rgba?\(\s*(\d+%)\s*,\s*(\d+%)\s*,\s*(\d+%)(?:\s*,\s*(\d+%|\d*\.\d+|[01]))?\s*\)$/i, cu = /^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
function Mn(n, t) {
  return n.endsWith("%") ? Number(n.substring(0, n.length - 1)) / t : Number(n);
}
function Hi(n) {
  throw new Error('failed to parse "' + n + '" as color');
}
function rl(n) {
  if (n.toLowerCase().startsWith("rgb")) {
    const r = n.match(lu) || n.match(au) || n.match(hu);
    if (r) {
      const o = r[4], a = 100 / 255;
      return [
        it(Mn(r[1], a) + 0.5 | 0, 0, 255),
        it(Mn(r[2], a) + 0.5 | 0, 0, 255),
        it(Mn(r[3], a) + 0.5 | 0, 0, 255),
        o !== void 0 ? it(Mn(o, 100), 0, 1) : 1
      ];
    }
    Hi(n);
  }
  if (n.startsWith("#")) {
    if (cu.test(n)) {
      const r = n.substring(1), o = r.length <= 4 ? 1 : 2, a = [0, 0, 0, 255];
      for (let l = 0, c = r.length; l < c; l += o) {
        let h = parseInt(r.substring(l, l + o), 16);
        o === 1 && (h += h << 4), a[l / o] = h;
      }
      return a[3] = a[3] / 255, a;
    }
    Hi(n);
  }
  const t = ou();
  t.fillStyle = "#abcdef";
  let e = t.fillStyle;
  t.fillStyle = n, t.fillStyle === e && (t.fillStyle = "#fedcba", e = t.fillStyle, t.fillStyle = n, t.fillStyle === e && Hi(n));
  const i = t.fillStyle;
  if (i.startsWith("#") || i.startsWith("rgba"))
    return rl(i);
  t.clearRect(0, 0, 1, 1), t.fillRect(0, 0, 1, 1);
  const s = Array.from(t.getImageData(0, 0, 1, 1).data);
  return s[3] = is(s[3] / 255, 3), s;
}
function uu(n) {
  return typeof n == "string" ? n : Yr(n);
}
const du = 1024, Wi = {};
let ks = 0;
function fu(n) {
  if (n.length === 4)
    return n;
  const t = n.slice();
  return t[3] = 1, t;
}
function Ns(n) {
  return n > 31308e-7 ? Math.pow(n, 1 / 2.4) * 269.025 - 14.025 : n * 3294.6;
}
function Gs(n) {
  return n > 0.2068965 ? Math.pow(n, 3) : (n - 4 / 29) * (108 / 841);
}
function zs(n) {
  return n > 10.314724 ? Math.pow((n + 14.025) / 269.025, 2.4) : n / 3294.6;
}
function Ws(n) {
  return n > 88564e-7 ? Math.pow(n, 1 / 3) : n / (108 / 841) + 4 / 29;
}
function Fo(n) {
  const t = zs(n[0]), e = zs(n[1]), i = zs(n[2]), s = Ws(t * 0.222488403 + e * 0.716873169 + i * 0.06060791), r = 500 * (Ws(t * 0.452247074 + e * 0.399439023 + i * 0.148375274) - s), o = 200 * (s - Ws(t * 0.016863605 + e * 0.117638439 + i * 0.865350722)), a = Math.atan2(o, r) * (180 / Math.PI);
  return [
    116 * s - 16,
    Math.sqrt(r * r + o * o),
    a < 0 ? a + 360 : a,
    n[3]
  ];
}
function gu(n) {
  const t = (n[0] + 16) / 116, e = n[1], i = n[2] * Math.PI / 180, s = Gs(t), r = Gs(t + e / 500 * Math.cos(i)), o = Gs(t - e / 200 * Math.sin(i)), a = Ns(r * 3.021973625 - s * 1.617392459 - o * 0.404875592), l = Ns(r * -0.943766287 + s * 1.916279586 + o * 0.027607165), c = Ns(r * 0.069407491 - s * 0.22898585 + o * 1.159737864);
  return [
    it(a + 0.5 | 0, 0, 255),
    it(l + 0.5 | 0, 0, 255),
    it(c + 0.5 | 0, 0, 255),
    n[3]
  ];
}
function Xr(n) {
  if (n === "none")
    return Wr;
  if (Wi.hasOwnProperty(n))
    return Wi[n];
  if (ks >= du) {
    let e = 0;
    for (const i in Wi)
      (e++ & 3) === 0 && (delete Wi[i], --ks);
  }
  const t = rl(n);
  t.length !== 4 && Hi(n);
  for (const e of t)
    isNaN(e) && Hi(n);
  return Wi[n] = t, ++ks, t;
}
function Ti(n) {
  return Array.isArray(n) ? n : Xr(n);
}
function Yr(n) {
  let t = n[0];
  t != (t | 0) && (t = t + 0.5 | 0);
  let e = n[1];
  e != (e | 0) && (e = e + 0.5 | 0);
  let i = n[2];
  i != (i | 0) && (i = i + 0.5 | 0);
  const s = n[3] === void 0 ? 1 : Math.round(n[3] * 1e3) / 1e3;
  return "rgba(" + t + "," + e + "," + i + "," + s + ")";
}
function ko(n) {
  return n[0] > 0 && n[1] > 0;
}
function _u(n, t, e) {
  return e === void 0 && (e = [0, 0]), e[0] = n[0] * t + 0.5 | 0, e[1] = n[1] * t + 0.5 | 0, e;
}
function Lt(n, t) {
  return Array.isArray(n) ? n : (t === void 0 ? t = [n, n] : (t[0] = n, t[1] = n), t);
}
let qe = 0;
const Ct = 1 << qe++, Z = 1 << qe++, St = 1 << qe++, Zt = 1 << qe++, He = 1 << qe++, Bi = 1 << qe++, bn = Math.pow(2, qe) - 1, Kr = {
  [Ct]: "boolean",
  [Z]: "number",
  [St]: "string",
  [Zt]: "color",
  [He]: "number[]",
  [Bi]: "size"
}, mu = Object.keys(Kr).map(Number).sort(ge);
function pu(n) {
  return n in Kr;
}
function Vi(n) {
  const t = [];
  for (const e of mu)
    Zi(n, e) && t.push(Kr[e]);
  return t.length === 0 ? "untyped" : t.length < 3 ? t.join(" or ") : t.slice(0, -1).join(", ") + ", or " + t[t.length - 1];
}
function Zi(n, t) {
  return (n & t) === t;
}
function xe(n, t) {
  return n === t;
}
class ot {
  /**
   * @param {number} type The value type.
   * @param {LiteralValue} value The literal value.
   */
  constructor(t, e) {
    if (!pu(t))
      throw new Error(
        `literal expressions must have a specific type, got ${Vi(t)}`
      );
    this.type = t, this.value = e;
  }
}
class yu {
  /**
   * @param {number} type The return type.
   * @param {string} operator The operator.
   * @param {...Expression} args The arguments.
   */
  constructor(t, e, ...i) {
    this.type = t, this.operator = e, this.args = i;
  }
}
function ol() {
  return {
    variables: /* @__PURE__ */ new Set(),
    properties: /* @__PURE__ */ new Set(),
    featureId: !1,
    geometryType: !1,
    mapState: !1
  };
}
function gt(n, t, e) {
  switch (typeof n) {
    case "boolean": {
      if (xe(t, St))
        return new ot(St, n ? "true" : "false");
      if (!Zi(t, Ct))
        throw new Error(
          `got a boolean, but expected ${Vi(t)}`
        );
      return new ot(Ct, n);
    }
    case "number": {
      if (xe(t, Bi))
        return new ot(Bi, Lt(n));
      if (xe(t, Ct))
        return new ot(Ct, !!n);
      if (xe(t, St))
        return new ot(St, n.toString());
      if (!Zi(t, Z))
        throw new Error(`got a number, but expected ${Vi(t)}`);
      return new ot(Z, n);
    }
    case "string": {
      if (xe(t, Zt))
        return new ot(Zt, Xr(n));
      if (xe(t, Ct))
        return new ot(Ct, !!n);
      if (!Zi(t, St))
        throw new Error(`got a string, but expected ${Vi(t)}`);
      return new ot(St, n);
    }
  }
  if (!Array.isArray(n))
    throw new Error("expression must be an array or a primitive value");
  if (n.length === 0)
    throw new Error("empty expression");
  if (typeof n[0] == "string")
    return Au(n, t, e);
  for (const i of n)
    if (typeof i != "number")
      throw new Error("expected an array of numbers");
  if (xe(t, Bi)) {
    if (n.length !== 2)
      throw new Error(
        `expected an array of two values for a size, got ${n.length}`
      );
    return new ot(Bi, n);
  }
  if (xe(t, Zt)) {
    if (n.length === 3)
      return new ot(Zt, [...n, 1]);
    if (n.length === 4)
      return new ot(Zt, n);
    throw new Error(
      `expected an array of 3 or 4 values for a color, got ${n.length}`
    );
  }
  if (!Zi(t, He))
    throw new Error(
      `got an array of numbers, but expected ${Vi(t)}`
    );
  return new ot(He, n);
}
const C = {
  Get: "get",
  Var: "var",
  Concat: "concat",
  GeometryType: "geometry-type",
  LineMetric: "line-metric",
  Any: "any",
  All: "all",
  Not: "!",
  Resolution: "resolution",
  Zoom: "zoom",
  Time: "time",
  Equal: "==",
  NotEqual: "!=",
  GreaterThan: ">",
  GreaterThanOrEqualTo: ">=",
  LessThan: "<",
  LessThanOrEqualTo: "<=",
  Multiply: "*",
  Divide: "/",
  Add: "+",
  Subtract: "-",
  Clamp: "clamp",
  Mod: "%",
  Pow: "^",
  Abs: "abs",
  Floor: "floor",
  Ceil: "ceil",
  Round: "round",
  Sin: "sin",
  Cos: "cos",
  Atan: "atan",
  Sqrt: "sqrt",
  Match: "match",
  Between: "between",
  Interpolate: "interpolate",
  Coalesce: "coalesce",
  Case: "case",
  In: "in",
  Number: "number",
  String: "string",
  Array: "array",
  Color: "color",
  Id: "id",
  Band: "band",
  Palette: "palette",
  ToString: "to-string",
  Has: "has"
}, Eu = {
  [C.Get]: N(W(1, 1 / 0), No),
  [C.Var]: N(W(1, 1), xu),
  [C.Has]: N(W(1, 1 / 0), No),
  [C.Id]: N(wu, ri),
  [C.Concat]: N(
    W(2, 1 / 0),
    H(St)
  ),
  [C.GeometryType]: N(Cu, ri),
  [C.LineMetric]: N(ri),
  [C.Resolution]: N(Xs, ri),
  [C.Zoom]: N(Xs, ri),
  [C.Time]: N(Xs, ri),
  [C.Any]: N(
    W(2, 1 / 0),
    H(Ct)
  ),
  [C.All]: N(
    W(2, 1 / 0),
    H(Ct)
  ),
  [C.Not]: N(
    W(1, 1),
    H(Ct)
  ),
  [C.Equal]: N(
    W(2, 2),
    H(bn)
  ),
  [C.NotEqual]: N(
    W(2, 2),
    H(bn)
  ),
  [C.GreaterThan]: N(
    W(2, 2),
    H(Z)
  ),
  [C.GreaterThanOrEqualTo]: N(
    W(2, 2),
    H(Z)
  ),
  [C.LessThan]: N(
    W(2, 2),
    H(Z)
  ),
  [C.LessThanOrEqualTo]: N(
    W(2, 2),
    H(Z)
  ),
  [C.Multiply]: N(
    W(2, 1 / 0),
    Go
  ),
  [C.Coalesce]: N(
    W(2, 1 / 0),
    Go
  ),
  [C.Divide]: N(
    W(2, 2),
    H(Z)
  ),
  [C.Add]: N(
    W(2, 1 / 0),
    H(Z)
  ),
  [C.Subtract]: N(
    W(2, 2),
    H(Z)
  ),
  [C.Clamp]: N(
    W(3, 3),
    H(Z)
  ),
  [C.Mod]: N(
    W(2, 2),
    H(Z)
  ),
  [C.Pow]: N(
    W(2, 2),
    H(Z)
  ),
  [C.Abs]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Floor]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Ceil]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Round]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Sin]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Cos]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Atan]: N(
    W(1, 2),
    H(Z)
  ),
  [C.Sqrt]: N(
    W(1, 1),
    H(Z)
  ),
  [C.Match]: N(
    W(4, 1 / 0),
    zo,
    Su
  ),
  [C.Between]: N(
    W(3, 3),
    H(Z)
  ),
  [C.Interpolate]: N(
    W(6, 1 / 0),
    zo,
    Tu
  ),
  [C.Case]: N(
    W(3, 1 / 0),
    Ru,
    Iu
  ),
  [C.In]: N(W(2, 2), vu),
  [C.Number]: N(
    W(1, 1 / 0),
    H(bn)
  ),
  [C.String]: N(
    W(1, 1 / 0),
    H(bn)
  ),
  [C.Array]: N(
    W(1, 1 / 0),
    H(Z)
  ),
  [C.Color]: N(
    W(1, 4),
    H(Z)
  ),
  [C.Band]: N(
    W(1, 3),
    H(Z)
  ),
  [C.Palette]: N(
    W(2, 2),
    Lu
  ),
  [C.ToString]: N(
    W(1, 1),
    H(Ct | Z | St | Zt)
  )
};
function No(n, t, e) {
  const i = n.length - 1, s = new Array(i);
  for (let r = 0; r < i; ++r) {
    const o = n[r + 1];
    switch (typeof o) {
      case "number": {
        s[r] = new ot(Z, o);
        break;
      }
      case "string": {
        s[r] = new ot(St, o);
        break;
      }
      default:
        throw new Error(
          `expected a string key or numeric array index for a get operation, got ${o}`
        );
    }
    r === 0 && e.properties.add(String(o));
  }
  return s;
}
function xu(n, t, e) {
  const i = n[1];
  if (typeof i != "string")
    throw new Error("expected a string argument for var operation");
  return e.variables.add(i), [new ot(St, i)];
}
function wu(n, t, e) {
  e.featureId = !0;
}
function Cu(n, t, e) {
  e.geometryType = !0;
}
function Xs(n, t, e) {
  e.mapState = !0;
}
function ri(n, t, e) {
  const i = n[0];
  if (n.length !== 1)
    throw new Error(`expected no arguments for ${i} operation`);
  return [];
}
function W(n, t) {
  return function(e, i, s) {
    const r = e[0], o = e.length - 1;
    if (n === t) {
      if (o !== n) {
        const a = n === 1 ? "" : "s";
        throw new Error(
          `expected ${n} argument${a} for ${r}, got ${o}`
        );
      }
    } else if (o < n || o > t) {
      const a = t === 1 / 0 ? `${n} or more` : `${n} to ${t}`;
      throw new Error(
        `expected ${a} arguments for ${r}, got ${o}`
      );
    }
  };
}
function Go(n, t, e) {
  const i = n.length - 1, s = new Array(i);
  for (let r = 0; r < i; ++r) {
    const o = gt(n[r + 1], t, e);
    s[r] = o;
  }
  return s;
}
function H(n) {
  return function(t, e, i) {
    const s = t.length - 1, r = new Array(s);
    for (let o = 0; o < s; ++o) {
      const a = gt(t[o + 1], n, i);
      r[o] = a;
    }
    return r;
  };
}
function Ru(n, t, e) {
  const i = n[0], s = n.length - 1;
  if (s % 2 === 0)
    throw new Error(
      `expected an odd number of arguments for ${i}, got ${s} instead`
    );
}
function zo(n, t, e) {
  const i = n[0], s = n.length - 1;
  if (s % 2 === 1)
    throw new Error(
      `expected an even number of arguments for operation ${i}, got ${s} instead`
    );
}
function Su(n, t, e) {
  const i = n.length - 1, s = St | Z | Ct, r = gt(n[1], s, e), o = gt(n[n.length - 1], t, e), a = new Array(i - 2);
  for (let l = 0; l < i - 2; l += 2) {
    try {
      const c = gt(n[l + 2], r.type, e);
      a[l] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 1} of match expression: ${c.message}`
      );
    }
    try {
      const c = gt(n[l + 3], o.type, e);
      a[l + 1] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 2} of match expression: ${c.message}`
      );
    }
  }
  return [r, ...a, o];
}
function Tu(n, t, e) {
  const i = n[1];
  let s;
  switch (i[0]) {
    case "linear":
      s = 1;
      break;
    case "exponential":
      const l = i[1];
      if (typeof l != "number" || l <= 0)
        throw new Error(
          `expected a number base for exponential interpolation, got ${JSON.stringify(l)} instead`
        );
      s = l;
      break;
    default:
      throw new Error(
        `invalid interpolation type: ${JSON.stringify(i)}`
      );
  }
  const r = new ot(Z, s);
  let o;
  try {
    o = gt(n[2], Z, e);
  } catch (l) {
    throw new Error(
      `failed to parse argument 1 in interpolate expression: ${l.message}`
    );
  }
  const a = new Array(n.length - 3);
  for (let l = 0; l < a.length; l += 2) {
    try {
      const c = gt(n[l + 3], Z, e);
      a[l] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 2} for interpolate expression: ${c.message}`
      );
    }
    try {
      const c = gt(n[l + 4], t, e);
      a[l + 1] = c;
    } catch (c) {
      throw new Error(
        `failed to parse argument ${l + 3} for interpolate expression: ${c.message}`
      );
    }
  }
  return [r, o, ...a];
}
function Iu(n, t, e) {
  const i = gt(n[n.length - 1], t, e), s = new Array(n.length - 1);
  for (let r = 0; r < s.length - 1; r += 2) {
    try {
      const o = gt(n[r + 1], Ct, e);
      s[r] = o;
    } catch (o) {
      throw new Error(
        `failed to parse argument ${r} of case expression: ${o.message}`
      );
    }
    try {
      const o = gt(n[r + 2], i.type, e);
      s[r + 1] = o;
    } catch (o) {
      throw new Error(
        `failed to parse argument ${r + 1} of case expression: ${o.message}`
      );
    }
  }
  return s[s.length - 1] = i, s;
}
function vu(n, t, e) {
  let i = n[2];
  if (!Array.isArray(i))
    throw new Error(
      'the second argument for the "in" operator must be an array'
    );
  let s;
  if (typeof i[0] == "string") {
    if (i[0] !== "literal")
      throw new Error(
        'for the "in" operator, a string array should be wrapped in a "literal" operator to disambiguate from expressions'
      );
    if (!Array.isArray(i[1]))
      throw new Error(
        'failed to parse "in" expression: the literal operator must be followed by an array'
      );
    i = i[1], s = St;
  } else
    s = Z;
  const r = new Array(i.length);
  for (let a = 0; a < r.length; a++)
    try {
      const l = gt(i[a], s, e);
      r[a] = l;
    } catch (l) {
      throw new Error(
        `failed to parse haystack item ${a} for "in" expression: ${l.message}`
      );
    }
  return [gt(n[1], s, e), ...r];
}
function Lu(n, t, e) {
  let i;
  try {
    i = gt(n[1], Z, e);
  } catch (o) {
    throw new Error(
      `failed to parse first argument in palette expression: ${o.message}`
    );
  }
  const s = n[2];
  if (!Array.isArray(s))
    throw new Error("the second argument of palette must be an array");
  const r = new Array(s.length);
  for (let o = 0; o < r.length; o++) {
    let a;
    try {
      a = gt(s[o], Zt, e);
    } catch (l) {
      throw new Error(
        `failed to parse color at index ${o} in palette expression: ${l.message}`
      );
    }
    if (!(a instanceof ot))
      throw new Error(
        `the palette color at index ${o} must be a literal value`
      );
    r[o] = a;
  }
  return [i, ...r];
}
function N(...n) {
  return function(t, e, i) {
    const s = t[0];
    let r;
    for (let o = 0; o < n.length; o++) {
      const a = n[o](t, e, i);
      if (o == n.length - 1) {
        if (!a)
          throw new Error(
            "expected last argument validator to return the parsed args"
          );
        r = a;
      }
    }
    return new yu(e, s, ...r);
  };
}
function Au(n, t, e) {
  const i = n[0], s = Eu[i];
  if (!s)
    throw new Error(`unknown operator: ${i}`);
  return s(n, t, e);
}
function al(n) {
  if (!n)
    return "";
  const t = n.getType();
  switch (t) {
    case "Point":
    case "LineString":
    case "Polygon":
      return t;
    case "MultiPoint":
    case "MultiLineString":
    case "MultiPolygon":
      return (
        /** @type {'Point'|'LineString'|'Polygon'} */
        t.substring(5)
      );
    case "Circle":
      return "Polygon";
    case "GeometryCollection":
      return al(
        /** @type {import("../geom/GeometryCollection.js").default} */
        n.getGeometries()[0]
      );
    default:
      return "";
  }
}
function ll() {
  return {
    variables: {},
    properties: {},
    resolution: NaN,
    featureId: null,
    geometryType: ""
  };
}
function ye(n, t, e) {
  const i = gt(n, t, e);
  return Ht(i);
}
function Ht(n, t) {
  if (n instanceof ot) {
    if (n.type === Zt && typeof n.value == "string") {
      const i = Xr(n.value);
      return function() {
        return i;
      };
    }
    return function() {
      return n.value;
    };
  }
  const e = n.operator;
  switch (e) {
    case C.Number:
    case C.String:
    case C.Coalesce:
      return Mu(n);
    case C.Get:
    case C.Var:
    case C.Has:
      return bu(n);
    case C.Id:
      return (i) => i.featureId;
    case C.GeometryType:
      return (i) => i.geometryType;
    case C.Concat: {
      const i = n.args.map((s) => Ht(s));
      return (s) => "".concat(...i.map((r) => r(s).toString()));
    }
    case C.Resolution:
      return (i) => i.resolution;
    case C.Any:
    case C.All:
    case C.Between:
    case C.In:
    case C.Not:
      return Ou(n);
    case C.Equal:
    case C.NotEqual:
    case C.LessThan:
    case C.LessThanOrEqualTo:
    case C.GreaterThan:
    case C.GreaterThanOrEqualTo:
      return Pu(n);
    case C.Multiply:
    case C.Divide:
    case C.Add:
    case C.Subtract:
    case C.Clamp:
    case C.Mod:
    case C.Pow:
    case C.Abs:
    case C.Floor:
    case C.Ceil:
    case C.Round:
    case C.Sin:
    case C.Cos:
    case C.Atan:
    case C.Sqrt:
      return Du(n);
    case C.Case:
      return Fu(n);
    case C.Match:
      return ku(n);
    case C.Interpolate:
      return Nu(n);
    case C.ToString:
      return Gu(n);
    default:
      throw new Error(`Unsupported operator ${e}`);
  }
}
function Mu(n, t) {
  const e = n.operator, i = n.args.length, s = new Array(i);
  for (let r = 0; r < i; ++r)
    s[r] = Ht(n.args[r]);
  switch (e) {
    case C.Coalesce:
      return (r) => {
        for (let o = 0; o < i; ++o) {
          const a = s[o](r);
          if (typeof a < "u" && a !== null)
            return a;
        }
        throw new Error("Expected one of the values to be non-null");
      };
    case C.Number:
    case C.String:
      return (r) => {
        for (let o = 0; o < i; ++o) {
          const a = s[o](r);
          if (typeof a === e)
            return a;
        }
        throw new Error(`Expected one of the values to be a ${e}`);
      };
    default:
      throw new Error(`Unsupported assertion operator ${e}`);
  }
}
function bu(n, t) {
  const i = (
    /** @type {string} */
    /** @type {LiteralExpression} */
    n.args[0].value
  );
  switch (n.operator) {
    case C.Get:
      return (s) => {
        const r = n.args;
        let o = s.properties[i];
        for (let a = 1, l = r.length; a < l; ++a) {
          const h = (
            /** @type {string|number} */
            /** @type {LiteralExpression} */
            r[a].value
          );
          o = o[h];
        }
        return o;
      };
    case C.Var:
      return (s) => s.variables[i];
    case C.Has:
      return (s) => {
        const r = n.args;
        if (!(i in s.properties))
          return !1;
        let o = s.properties[i];
        for (let a = 1, l = r.length; a < l; ++a) {
          const h = (
            /** @type {string|number} */
            /** @type {LiteralExpression} */
            r[a].value
          );
          if (!o || !Object.hasOwn(o, h))
            return !1;
          o = o[h];
        }
        return !0;
      };
    default:
      throw new Error(`Unsupported accessor operator ${n.operator}`);
  }
}
function Pu(n, t) {
  const e = n.operator, i = Ht(n.args[0]), s = Ht(n.args[1]);
  switch (e) {
    case C.Equal:
      return (r) => i(r) === s(r);
    case C.NotEqual:
      return (r) => i(r) !== s(r);
    case C.LessThan:
      return (r) => i(r) < s(r);
    case C.LessThanOrEqualTo:
      return (r) => i(r) <= s(r);
    case C.GreaterThan:
      return (r) => i(r) > s(r);
    case C.GreaterThanOrEqualTo:
      return (r) => i(r) >= s(r);
    default:
      throw new Error(`Unsupported comparison operator ${e}`);
  }
}
function Ou(n, t) {
  const e = n.operator, i = n.args.length, s = new Array(i);
  for (let r = 0; r < i; ++r)
    s[r] = Ht(n.args[r]);
  switch (e) {
    case C.Any:
      return (r) => {
        for (let o = 0; o < i; ++o)
          if (s[o](r))
            return !0;
        return !1;
      };
    case C.All:
      return (r) => {
        for (let o = 0; o < i; ++o)
          if (!s[o](r))
            return !1;
        return !0;
      };
    case C.Between:
      return (r) => {
        const o = s[0](r), a = s[1](r), l = s[2](r);
        return o >= a && o <= l;
      };
    case C.In:
      return (r) => {
        const o = s[0](r);
        for (let a = 1; a < i; ++a)
          if (o === s[a](r))
            return !0;
        return !1;
      };
    case C.Not:
      return (r) => !s[0](r);
    default:
      throw new Error(`Unsupported logical operator ${e}`);
  }
}
function Du(n, t) {
  const e = n.operator, i = n.args.length, s = new Array(i);
  for (let r = 0; r < i; ++r)
    s[r] = Ht(n.args[r]);
  switch (e) {
    case C.Multiply:
      return (r) => {
        let o = 1;
        for (let a = 0; a < i; ++a)
          o *= s[a](r);
        return o;
      };
    case C.Divide:
      return (r) => s[0](r) / s[1](r);
    case C.Add:
      return (r) => {
        let o = 0;
        for (let a = 0; a < i; ++a)
          o += s[a](r);
        return o;
      };
    case C.Subtract:
      return (r) => s[0](r) - s[1](r);
    case C.Clamp:
      return (r) => {
        const o = s[0](r), a = s[1](r);
        if (o < a)
          return a;
        const l = s[2](r);
        return o > l ? l : o;
      };
    case C.Mod:
      return (r) => s[0](r) % s[1](r);
    case C.Pow:
      return (r) => Math.pow(s[0](r), s[1](r));
    case C.Abs:
      return (r) => Math.abs(s[0](r));
    case C.Floor:
      return (r) => Math.floor(s[0](r));
    case C.Ceil:
      return (r) => Math.ceil(s[0](r));
    case C.Round:
      return (r) => Math.round(s[0](r));
    case C.Sin:
      return (r) => Math.sin(s[0](r));
    case C.Cos:
      return (r) => Math.cos(s[0](r));
    case C.Atan:
      return i === 2 ? (r) => Math.atan2(s[0](r), s[1](r)) : (r) => Math.atan(s[0](r));
    case C.Sqrt:
      return (r) => Math.sqrt(s[0](r));
    default:
      throw new Error(`Unsupported numeric operator ${e}`);
  }
}
function Fu(n, t) {
  const e = n.args.length, i = new Array(e);
  for (let s = 0; s < e; ++s)
    i[s] = Ht(n.args[s]);
  return (s) => {
    for (let r = 0; r < e - 1; r += 2)
      if (i[r](s))
        return i[r + 1](s);
    return i[e - 1](s);
  };
}
function ku(n, t) {
  const e = n.args.length, i = new Array(e);
  for (let s = 0; s < e; ++s)
    i[s] = Ht(n.args[s]);
  return (s) => {
    const r = i[0](s);
    for (let o = 1; o < e - 1; o += 2)
      if (r === i[o](s))
        return i[o + 1](s);
    return i[e - 1](s);
  };
}
function Nu(n, t) {
  const e = n.args.length, i = new Array(e);
  for (let s = 0; s < e; ++s)
    i[s] = Ht(n.args[s]);
  return (s) => {
    const r = i[0](s), o = i[1](s);
    let a, l;
    for (let c = 2; c < e; c += 2) {
      const h = i[c](s);
      let u = i[c + 1](s);
      const d = Array.isArray(u);
      if (d && (u = fu(u)), h >= o)
        return c === 2 ? u : d ? zu(
          r,
          o,
          a,
          l,
          h,
          u
        ) : Ui(
          r,
          o,
          a,
          l,
          h,
          u
        );
      a = h, l = u;
    }
    return l;
  };
}
function Gu(n, t) {
  const e = n.operator, i = n.args.length, s = new Array(i);
  for (let r = 0; r < i; ++r)
    s[r] = Ht(n.args[r]);
  switch (e) {
    case C.ToString:
      return (r) => {
        const o = s[0](r);
        return n.args[0].type === Zt ? Yr(o) : o.toString();
      };
    default:
      throw new Error(`Unsupported convert operator ${e}`);
  }
}
function Ui(n, t, e, i, s, r) {
  const o = s - e;
  if (o === 0)
    return i;
  const a = t - e, l = n === 1 ? a / o : (Math.pow(n, a) - 1) / (Math.pow(n, o) - 1);
  return i + l * (r - i);
}
function zu(n, t, e, i, s, r) {
  if (s - e === 0)
    return i;
  const a = Fo(i), l = Fo(r);
  let c = l[2] - a[2];
  c > 180 ? c -= 360 : c < -180 && (c += 360);
  const h = [
    Ui(n, t, e, a[0], s, l[0]),
    Ui(n, t, e, a[1], s, l[1]),
    a[2] + Ui(n, t, e, 0, s, c),
    Ui(n, t, e, i[3], s, r[3])
  ];
  return gu(h);
}
const X = {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  ERROR: 3
};
function Wu(n, t, e) {
  const i = (
    /** @type {HTMLImageElement} */
    n
  );
  let s = !0, r = !1, o = !1;
  const a = [
    zn(i, z.LOAD, function() {
      o = !0, r || t();
    })
  ];
  return i.src && ma ? (r = !0, i.decode().then(function() {
    s && t();
  }).catch(function(l) {
    s && (o ? t() : e());
  })) : a.push(zn(i, z.ERROR, e)), function() {
    s = !1, a.forEach(tt);
  };
}
function Xu(n, t) {
  return new Promise((e, i) => {
    function s() {
      o(), e(n);
    }
    function r() {
      o(), i(new Error("Image load error"));
    }
    function o() {
      n.removeEventListener("load", s), n.removeEventListener("error", r);
    }
    n.addEventListener("load", s), n.addEventListener("error", r);
  });
}
function Yu(n, t) {
  return t && (n.src = t), n.src && ma ? new Promise(
    (e, i) => n.decode().then(() => e(n)).catch(
      (s) => n.complete && n.width ? e(n) : i(s)
    )
  ) : Xu(n);
}
class Ku {
  constructor() {
    this.cache_ = {}, this.patternCache_ = {}, this.cacheSize_ = 0, this.maxCacheSize_ = 1024;
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    this.cache_ = {}, this.patternCache_ = {}, this.cacheSize_ = 0;
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.cacheSize_ > this.maxCacheSize_;
  }
  /**
   * FIXME empty description for jsdoc
   */
  expire() {
    if (this.canExpireCache()) {
      let t = 0;
      for (const e in this.cache_) {
        const i = this.cache_[e];
        (t++ & 3) === 0 && !i.hasListener() && (delete this.cache_[e], delete this.patternCache_[e], --this.cacheSize_);
      }
    }
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @return {import("./IconImage.js").default} Icon image.
   */
  get(t, e, i) {
    const s = Ys(t, e, i);
    return s in this.cache_ ? this.cache_[s] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @return {CanvasPattern} Icon image.
   */
  getPattern(t, e, i) {
    const s = Ys(t, e, i);
    return s in this.patternCache_ ? this.patternCache_[s] : null;
  }
  /**
   * @param {string} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../color.js").Color|string|null} color Color.
   * @param {import("./IconImage.js").default|null} iconImage Icon image.
   * @param {boolean} [pattern] Also cache a `'repeat'` pattern with this `iconImage`.
   */
  set(t, e, i, s, r) {
    const o = Ys(t, e, i), a = o in this.cache_;
    this.cache_[o] = s, r && (s.getImageState() === X.IDLE && s.load(), s.getImageState() === X.LOADING ? s.ready().then(() => {
      this.patternCache_[o] = Zn().createPattern(
        s.getImage(1),
        "repeat"
      );
    }) : this.patternCache_[o] = Zn().createPattern(
      s.getImage(1),
      "repeat"
    )), a || ++this.cacheSize_;
  }
  /**
   * Set the cache size of the icon cache. Default is `1024`. Change this value when
   * your map uses more than 1024 different icon images and you are not caching icon
   * styles on the application level.
   * @param {number} maxCacheSize Cache max size.
   * @api
   */
  setSize(t) {
    this.maxCacheSize_ = t, this.expire();
  }
}
function Ys(n, t, e) {
  const i = e ? Ti(e) : "null";
  return t + ":" + n + ":" + i;
}
const zt = new Ku();
let Xi = null;
class hl extends es {
  /**
   * @param {HTMLImageElement|HTMLCanvasElement|ImageBitmap|null} image Image.
   * @param {string|undefined} src Src.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("../ImageState.js").default|undefined} imageState Image state.
   * @param {import("../color.js").Color|string|null} color Color.
   */
  constructor(t, e, i, s, r) {
    super(), this.hitDetectionImage_ = null, this.image_ = t, this.crossOrigin_ = i, this.canvas_ = {}, this.color_ = r, this.imageState_ = s === void 0 ? X.IDLE : s, this.size_ = t && t.width && t.height ? [t.width, t.height] : null, this.src_ = e, this.tainted_, this.ready_ = null;
  }
  /**
   * @private
   */
  initializeImage_() {
    this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_);
  }
  /**
   * @private
   * @return {boolean} The image canvas is tainted.
   */
  isTainted_() {
    if (this.tainted_ === void 0 && this.imageState_ === X.LOADED) {
      Xi || (Xi = at(1, 1, void 0, {
        willReadFrequently: !0
      })), Xi.drawImage(this.image_, 0, 0);
      try {
        Xi.getImageData(0, 0, 1, 1), this.tainted_ = !1;
      } catch {
        Xi = null, this.tainted_ = !0;
      }
    }
    return this.tainted_ === !0;
  }
  /**
   * @private
   */
  dispatchChangeEvent_() {
    this.dispatchEvent(z.CHANGE);
  }
  /**
   * @private
   */
  handleImageError_() {
    this.imageState_ = X.ERROR, this.dispatchChangeEvent_();
  }
  /**
   * @private
   */
  handleImageLoad_() {
    this.imageState_ = X.LOADED, this.size_ = [this.image_.width, this.image_.height], this.dispatchChangeEvent_();
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image or Canvas element or image bitmap.
   */
  getImage(t) {
    return this.image_ || this.initializeImage_(), this.replaceColor_(t), this.canvas_[t] ? this.canvas_[t] : this.image_;
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Image or Canvas element.
   */
  getPixelRatio(t) {
    return this.replaceColor_(t), this.canvas_[t] ? t : 1;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image element.
   */
  getHitDetectionImage() {
    if (this.image_ || this.initializeImage_(), !this.hitDetectionImage_)
      if (this.isTainted_()) {
        const t = this.size_[0], e = this.size_[1], i = at(t, e);
        i.fillRect(0, 0, t, e), this.hitDetectionImage_ = i.canvas;
      } else
        this.hitDetectionImage_ = this.image_;
    return this.hitDetectionImage_;
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   */
  getSize() {
    return this.size_;
  }
  /**
   * @return {string|undefined} Image src.
   */
  getSrc() {
    return this.src_;
  }
  /**
   * Load not yet loaded URI.
   */
  load() {
    if (this.imageState_ === X.IDLE) {
      this.image_ || this.initializeImage_(), this.imageState_ = X.LOADING;
      try {
        this.src_ !== void 0 && (this.image_.src = this.src_);
      } catch {
        this.handleImageError_();
      }
      this.image_ instanceof HTMLImageElement && Yu(this.image_, this.src_).then((t) => {
        this.image_ = t, this.handleImageLoad_();
      }).catch(this.handleImageError_.bind(this));
    }
  }
  /**
   * @param {number} pixelRatio Pixel ratio.
   * @private
   */
  replaceColor_(t) {
    if (!this.color_ || this.canvas_[t] || this.imageState_ !== X.LOADED)
      return;
    const e = this.image_, i = at(
      Math.ceil(e.width * t),
      Math.ceil(e.height * t)
    ), s = i.canvas;
    i.scale(t, t), i.drawImage(e, 0, 0), i.globalCompositeOperation = "multiply", i.fillStyle = uu(this.color_), i.fillRect(0, 0, s.width / t, s.height / t), i.globalCompositeOperation = "destination-in", i.drawImage(e, 0, 0), this.canvas_[t] = s;
  }
  /**
   * @return {Promise<void>} Promise that resolves when the image is loaded.
   */
  ready() {
    return this.ready_ || (this.ready_ = new Promise((t) => {
      if (this.imageState_ === X.LOADED || this.imageState_ === X.ERROR)
        t();
      else {
        const e = () => {
          (this.imageState_ === X.LOADED || this.imageState_ === X.ERROR) && (this.removeEventListener(z.CHANGE, e), t());
        };
        this.addEventListener(z.CHANGE, e);
      }
    })), this.ready_;
  }
}
function Br(n, t, e, i, s, r) {
  let o = t === void 0 ? void 0 : zt.get(t, e, s);
  return o || (o = new hl(
    n,
    n && "src" in n ? n.src || void 0 : t,
    e,
    i,
    s
  ), zt.set(t, e, s, o, r)), r && o && !zt.getPattern(t, e, s) && zt.set(t, e, s, o, r), o;
}
function ne(n) {
  return n ? Array.isArray(n) ? Yr(n) : typeof n == "object" && "src" in n ? Bu(n) : n : null;
}
function Bu(n) {
  if (!n.offset || !n.size)
    return zt.getPattern(n.src, "anonymous", n.color);
  const t = n.src + ":" + n.offset, e = zt.getPattern(
    t,
    void 0,
    n.color
  );
  if (e)
    return e;
  const i = zt.get(n.src, "anonymous", null);
  if (i.getImageState() !== X.LOADED)
    return null;
  const s = at(
    n.size[0],
    n.size[1]
  );
  return s.drawImage(
    i.getImage(1),
    n.offset[0],
    n.offset[1],
    n.size[0],
    n.size[1],
    0,
    0,
    n.size[0],
    n.size[1]
  ), Br(
    s.canvas,
    t,
    void 0,
    X.LOADED,
    n.color,
    !0
  ), zt.getPattern(t, void 0, n.color);
}
const cl = "10px sans-serif", Tt = "#000", Ii = "round", _e = [], me = 0, vi = "round", rn = 10, on = "#000", an = "center", Un = "middle", Ye = [0, 0, 0, 0], ln = 1, ue = new $t();
let ui = null, hr;
const cr = {}, Vu = function() {
  const t = "32px ", e = ["monospace", "serif"], i = e.length, s = "wmytzilWMYTZIL@#/&?$%10";
  let r, o;
  function a(c, h, u) {
    let d = !0;
    for (let f = 0; f < i; ++f) {
      const g = e[f];
      if (o = jn(
        c + " " + h + " " + t + g,
        s
      ), u != g) {
        const m = jn(
          c + " " + h + " " + t + u + "," + g,
          s
        );
        d = d && m != o;
      }
    }
    return !!d;
  }
  function l() {
    let c = !0;
    const h = ue.getKeys();
    for (let u = 0, d = h.length; u < d; ++u) {
      const f = h[u];
      if (ue.get(f) < 100) {
        const [g, m, _] = f.split(`
`);
        a(g, m, _) ? (Li(cr), ui = null, hr = void 0, ue.set(f, 100)) : (ue.set(f, ue.get(f) + 1, !0), c = !1);
      }
    }
    c && (clearInterval(r), r = void 0);
  }
  return function(c) {
    const h = ja(c);
    if (!h)
      return;
    const u = h.families;
    for (let d = 0, f = u.length; d < f; ++d) {
      const g = u[d], m = h.style + `
` + h.weight + `
` + g;
      ue.get(m) === void 0 && (ue.set(m, 100, !0), a(h.style, h.weight, g) || (ue.set(m, 0, !0), r === void 0 && (r = setInterval(l, 32))));
    }
  };
}(), Zu = /* @__PURE__ */ function() {
  let n;
  return function(t) {
    let e = cr[t];
    if (e == null) {
      if (_a) {
        const i = ja(t), s = ul(t, "Žg");
        e = (isNaN(Number(i.lineHeight)) ? 1.2 : Number(i.lineHeight)) * (s.actualBoundingBoxAscent + s.actualBoundingBoxDescent);
      } else
        n || (n = document.createElement("div"), n.innerHTML = "M", n.style.minHeight = "0", n.style.maxHeight = "none", n.style.height = "auto", n.style.padding = "0", n.style.border = "none", n.style.position = "absolute", n.style.display = "block", n.style.left = "-99999px"), n.style.font = t, document.body.appendChild(n), e = n.offsetHeight, document.body.removeChild(n);
      cr[t] = e;
    }
    return e;
  };
}();
function ul(n, t) {
  return ui || (ui = at(1, 1)), n != hr && (ui.font = n, hr = ui.font), ui.measureText(t);
}
function jn(n, t) {
  return ul(n, t).width;
}
function Wo(n, t, e) {
  if (t in e)
    return e[t];
  const i = t.split(`
`).reduce((s, r) => Math.max(s, jn(n, r)), 0);
  return e[t] = i, i;
}
function Uu(n, t) {
  const e = [], i = [], s = [];
  let r = 0, o = 0, a = 0, l = 0;
  for (let c = 0, h = t.length; c <= h; c += 2) {
    const u = t[c];
    if (u === `
` || c === h) {
      r = Math.max(r, o), s.push(o), o = 0, a += l, l = 0;
      continue;
    }
    const d = t[c + 1] || n.font, f = jn(d, u);
    e.push(f), o += f;
    const g = Zu(d);
    i.push(g), l = Math.max(l, g);
  }
  return { width: r, height: a, widths: e, heights: i, lineWidths: s };
}
function ju(n, t, e, i, s, r, o, a, l, c, h) {
  n.save(), e !== 1 && (n.globalAlpha === void 0 ? n.globalAlpha = (u) => u.globalAlpha *= e : n.globalAlpha *= e), t && n.transform.apply(n, t), /** @type {*} */
  i.contextInstructions ? (n.translate(l, c), n.scale(h[0], h[1]), Hu(
    /** @type {Label} */
    i,
    n
  )) : h[0] < 0 || h[1] < 0 ? (n.translate(l, c), n.scale(h[0], h[1]), n.drawImage(
    /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
    i,
    s,
    r,
    o,
    a,
    0,
    0,
    o,
    a
  )) : n.drawImage(
    /** @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} */
    i,
    s,
    r,
    o,
    a,
    l,
    c,
    o * h[0],
    a * h[1]
  ), n.restore();
}
function Hu(n, t) {
  const e = n.contextInstructions;
  for (let i = 0, s = e.length; i < s; i += 2)
    Array.isArray(e[i + 1]) ? t[e[i]].apply(
      t,
      e[i + 1]
    ) : t[e[i]] = e[i + 1];
}
class _s {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    this.opacity_ = t.opacity, this.rotateWithView_ = t.rotateWithView, this.rotation_ = t.rotation, this.scale_ = t.scale, this.scaleArray_ = Lt(t.scale), this.displacement_ = t.displacement, this.declutterMode_ = t.declutterMode;
  }
  /**
   * Clones the style.
   * @return {ImageStyle} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale();
    return new _s({
      opacity: this.getOpacity(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the symbolizer opacity.
   * @return {number} Opacity.
   * @api
   */
  getOpacity() {
    return this.opacity_;
  }
  /**
   * Determine whether the symbolizer rotates with the map.
   * @return {boolean} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Get the symoblizer rotation.
   * @return {number} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the symbolizer scale.
   * @return {number|import("../size.js").Size} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the displacement of the shape
   * @return {Array<number>} Shape's center displacement
   * @api
   */
  getDisplacement() {
    return this.displacement_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {import("./Style.js").DeclutterMode} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @abstract
   * @return {Array<number>} Anchor.
   */
  getAnchor() {
    return j();
  }
  /**
   * Get the image element for the symbolizer.
   * @abstract
   * @param {number} pixelRatio Pixel ratio.
   * @return {import('../DataTile.js').ImageLike} Image element.
   */
  getImage(t) {
    return j();
  }
  /**
   * @abstract
   * @return {import('../DataTile.js').ImageLike} Image element.
   */
  getHitDetectionImage() {
    return j();
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   */
  getPixelRatio(t) {
    return 1;
  }
  /**
   * @abstract
   * @return {import("../ImageState.js").default} Image state.
   */
  getImageState() {
    return j();
  }
  /**
   * @abstract
   * @return {import("../size.js").Size} Image size.
   */
  getImageSize() {
    return j();
  }
  /**
   * Get the origin of the symbolizer.
   * @abstract
   * @return {Array<number>} Origin.
   */
  getOrigin() {
    return j();
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @abstract
   * @return {import("../size.js").Size} Size.
   */
  getSize() {
    return j();
  }
  /**
   * Set the displacement.
   *
   * @param {Array<number>} displacement Displacement.
   * @api
   */
  setDisplacement(t) {
    this.displacement_ = t;
  }
  /**
   * Set the opacity.
   *
   * @param {number} opacity Opacity.
   * @api
   */
  setOpacity(t) {
    this.opacity_ = t;
  }
  /**
   * Set whether to rotate the style with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  /**
   * Set the rotation.
   *
   * @param {number} rotation Rotation.
   * @api
   */
  setRotation(t) {
    this.rotation_ = t;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   */
  setScale(t) {
    this.scale_ = t, this.scaleArray_ = Lt(t);
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  listenImageChange(t) {
    j();
  }
  /**
   * Load not yet loaded URI.
   * @abstract
   */
  load() {
    j();
  }
  /**
   * @abstract
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   */
  unlistenImageChange(t) {
    j();
  }
  /**
   * @return {Promise<void>} `false` or Promise that resolves when the style is ready to use.
   */
  ready() {
    return Promise.resolve();
  }
}
class ms extends _s {
  /**
   * @param {Options} options Options.
   */
  constructor(t) {
    super({
      opacity: 1,
      rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      scale: t.scale !== void 0 ? t.scale : 1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode
    }), this.hitDetectionCanvas_ = null, this.fill_ = t.fill !== void 0 ? t.fill : null, this.origin_ = [0, 0], this.points_ = t.points, this.radius = t.radius, this.radius2_ = t.radius2, this.angle_ = t.angle !== void 0 ? t.angle : 0, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.size_, this.renderOptions_, this.imageState_ = this.fill_ && this.fill_.loading() ? X.LOADING : X.LOADED, this.imageState_ === X.LOADING && this.ready().then(() => this.imageState_ = X.LOADED), this.render();
  }
  /**
   * Clones the style.
   * @return {RegularShape} The cloned style.
   * @api
   * @override
   */
  clone() {
    const t = this.getScale(), e = new ms({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      points: this.getPoints(),
      radius: this.getRadius(),
      radius2: this.getRadius2(),
      angle: this.getAngle(),
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      scale: Array.isArray(t) ? t.slice() : t,
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    return e.setOpacity(this.getOpacity()), e;
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   * @override
   */
  getAnchor() {
    const t = this.size_, e = this.getDisplacement(), i = this.getScaleArray();
    return [
      t[0] / 2 - e[0] / i[0],
      t[1] / 2 + e[1] / i[1]
    ];
  }
  /**
   * Get the angle used in generating the shape.
   * @return {number} Shape's rotation in radians.
   * @api
   */
  getAngle() {
    return this.angle_;
  }
  /**
   * Get the fill style for the shape.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t, this.render();
  }
  /**
   * @return {HTMLCanvasElement} Image element.
   * @override
   */
  getHitDetectionImage() {
    return this.hitDetectionCanvas_ || (this.hitDetectionCanvas_ = this.createHitDetectionCanvas_(
      this.renderOptions_
    )), this.hitDetectionCanvas_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLCanvasElement} Image or Canvas element.
   * @api
   * @override
   */
  getImage(t) {
    const e = this.fill_?.getKey(), i = `${t},${this.angle_},${this.radius},${this.radius2_},${this.points_},${e}` + Object.values(this.renderOptions_).join(",");
    let s = (
      /** @type {HTMLCanvasElement} */
      zt.get(i, null, null)?.getImage(1)
    );
    if (!s) {
      const r = this.renderOptions_, o = Math.ceil(r.size * t), a = at(o, o);
      this.draw_(r, a, t), s = a.canvas, zt.set(
        i,
        null,
        null,
        new hl(s, void 0, null, X.LOADED, null)
      );
    }
    return s;
  }
  /**
   * Get the image pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Pixel ratio.
   * @override
   */
  getPixelRatio(t) {
    return t;
  }
  /**
   * @return {import("../size.js").Size} Image size.
   * @override
   */
  getImageSize() {
    return this.size_;
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   * @override
   */
  getImageState() {
    return this.imageState_;
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   * @override
   */
  getOrigin() {
    return this.origin_;
  }
  /**
   * Get the number of points for generating the shape.
   * @return {number} Number of points for stars and regular polygons.
   * @api
   */
  getPoints() {
    return this.points_;
  }
  /**
   * Get the (primary) radius for the shape.
   * @return {number} Radius.
   * @api
   */
  getRadius() {
    return this.radius;
  }
  /**
   * Get the secondary radius for the shape.
   * @return {number|undefined} Radius2.
   * @api
   */
  getRadius2() {
    return this.radius2_;
  }
  /**
   * Get the size of the symbolizer (in pixels).
   * @return {import("../size.js").Size} Size.
   * @api
   * @override
   */
  getSize() {
    return this.size_;
  }
  /**
   * Get the stroke style for the shape.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t, this.render();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  listenImageChange(t) {
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  unlistenImageChange(t) {
  }
  /**
   * Calculate additional canvas size needed for the miter.
   * @param {string} lineJoin Line join
   * @param {number} strokeWidth Stroke width
   * @param {number} miterLimit Miter limit
   * @return {number} Additional canvas size needed
   * @private
   */
  calculateLineJoinSize_(t, e, i) {
    if (e === 0 || this.points_ === 1 / 0 || t !== "bevel" && t !== "miter")
      return e;
    let s = this.radius, r = this.radius2_ === void 0 ? s : this.radius2_;
    if (s < r) {
      const R = s;
      s = r, r = R;
    }
    const o = this.radius2_ === void 0 ? this.points_ : this.points_ * 2, a = 2 * Math.PI / o, l = r * Math.sin(a), c = Math.sqrt(r * r - l * l), h = s - c, u = Math.sqrt(l * l + h * h), d = u / l;
    if (t === "miter" && d <= i)
      return d * e;
    const f = e / 2 / d, g = e / 2 * (h / u), _ = Math.sqrt((s + f) * (s + f) + g * g) - s;
    if (this.radius2_ === void 0 || t === "bevel")
      return _ * 2;
    const p = s * Math.sin(a), E = Math.sqrt(s * s - p * p), w = r - E, x = Math.sqrt(p * p + w * w) / p;
    if (x <= i) {
      const R = x * e / 2 - r - s;
      return 2 * Math.max(_, R);
    }
    return _ * 2;
  }
  /**
   * @return {RenderOptions}  The render options
   * @protected
   */
  createRenderOptions() {
    let t = Ii, e = vi, i = 0, s = null, r = 0, o, a = 0;
    this.stroke_ && (o = ne(this.stroke_.getColor() ?? on), a = this.stroke_.getWidth() ?? ln, s = this.stroke_.getLineDash(), r = this.stroke_.getLineDashOffset() ?? 0, e = this.stroke_.getLineJoin() ?? vi, t = this.stroke_.getLineCap() ?? Ii, i = this.stroke_.getMiterLimit() ?? rn);
    const l = this.calculateLineJoinSize_(e, a, i), c = Math.max(this.radius, this.radius2_ || 0), h = Math.ceil(2 * c + l);
    return {
      strokeStyle: o,
      strokeWidth: a,
      size: h,
      lineCap: t,
      lineDash: s,
      lineDashOffset: r,
      lineJoin: e,
      miterLimit: i
    };
  }
  /**
   * @protected
   */
  render() {
    this.renderOptions_ = this.createRenderOptions();
    const t = this.renderOptions_.size;
    this.hitDetectionCanvas_ = null, this.size_ = [t, t];
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The rendering context.
   * @param {number} pixelRatio The pixel ratio.
   */
  draw_(t, e, i) {
    if (e.scale(i, i), e.translate(t.size / 2, t.size / 2), this.createPath_(e), this.fill_) {
      let s = this.fill_.getColor();
      s === null && (s = Tt), e.fillStyle = ne(s), e.fill();
    }
    t.strokeStyle && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineCap = t.lineCap, e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @return {HTMLCanvasElement} Canvas containing the icon
   */
  createHitDetectionCanvas_(t) {
    let e;
    if (this.fill_) {
      let i = this.fill_.getColor(), s = 0;
      typeof i == "string" && (i = Ti(i)), i === null ? s = 1 : Array.isArray(i) && (s = i.length === 4 ? i[3] : 1), s === 0 && (e = at(t.size, t.size), this.drawHitDetectionCanvas_(t, e));
    }
    return e ? e.canvas : this.getImage(1);
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context The context to draw in.
   */
  createPath_(t) {
    let e = this.points_;
    const i = this.radius;
    if (e === 1 / 0)
      t.arc(0, 0, i, 0, 2 * Math.PI);
    else {
      const s = this.radius2_ === void 0 ? i : this.radius2_;
      this.radius2_ !== void 0 && (e *= 2);
      const r = this.angle_ - Math.PI / 2, o = 2 * Math.PI / e;
      for (let a = 0; a < e; a++) {
        const l = r + a * o, c = a % 2 === 0 ? i : s;
        t.lineTo(c * Math.cos(l), c * Math.sin(l));
      }
      t.closePath();
    }
  }
  /**
   * @private
   * @param {RenderOptions} renderOptions Render options.
   * @param {CanvasRenderingContext2D} context The context.
   */
  drawHitDetectionCanvas_(t, e) {
    e.translate(t.size / 2, t.size / 2), this.createPath_(e), e.fillStyle = Tt, e.fill(), t.strokeStyle && (e.strokeStyle = t.strokeStyle, e.lineWidth = t.strokeWidth, t.lineDash && (e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset), e.lineJoin = t.lineJoin, e.miterLimit = t.miterLimit, e.stroke());
  }
  /**
   * @override
   */
  ready() {
    return this.fill_ ? this.fill_.ready() : Promise.resolve();
  }
}
class qt extends ms {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || { radius: 5 }, super({
      points: 1 / 0,
      fill: t.fill,
      radius: t.radius,
      stroke: t.stroke,
      scale: t.scale !== void 0 ? t.scale : 1,
      rotation: t.rotation !== void 0 ? t.rotation : 0,
      rotateWithView: t.rotateWithView !== void 0 ? t.rotateWithView : !1,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      declutterMode: t.declutterMode
    });
  }
  /**
   * Clones the style.
   * @return {CircleStyle} The cloned style.
   * @api
   * @override
   */
  clone() {
    const t = this.getScale(), e = new qt({
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      radius: this.getRadius(),
      scale: Array.isArray(t) ? t.slice() : t,
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
    return e.setOpacity(this.getOpacity()), e;
  }
  /**
   * Set the circle radius.
   *
   * @param {number} radius Circle radius.
   * @api
   */
  setRadius(t) {
    this.radius = t, this.render();
  }
}
class ht {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.patternImage_ = null, this.color_ = null, t.color !== void 0 && this.setColor(t.color);
  }
  /**
   * Clones the style. The color is not cloned if it is a {@link module:ol/colorlike~ColorLike}.
   * @return {Fill} The cloned style.
   * @api
   */
  clone() {
    const t = this.getColor();
    return new ht({
      color: Array.isArray(t) ? t.slice() : t || void 0
    });
  }
  /**
   * Get the fill color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike|import('../colorlike.js').PatternDescriptor|null} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike|import('../colorlike.js').PatternDescriptor|null} color Color.
   * @api
   */
  setColor(t) {
    if (t !== null && typeof t == "object" && "src" in t) {
      const e = Br(
        null,
        t.src,
        "anonymous",
        void 0,
        t.offset ? null : t.color ? t.color : null,
        !(t.offset && t.size)
      );
      e.ready().then(() => {
        this.patternImage_ = null;
      }), e.getImageState() === X.IDLE && e.load(), e.getImageState() === X.LOADING && (this.patternImage_ = e);
    }
    this.color_ = t;
  }
  /**
   * @return {string} Key of the fill for cache lookup.
   */
  getKey() {
    const t = this.getColor();
    return t ? t instanceof CanvasPattern || t instanceof CanvasGradient ? B(t) : typeof t == "object" && "src" in t ? t.src + ":" + t.offset : Ti(t).toString() : "";
  }
  /**
   * @return {boolean} The fill style is loading an image pattern.
   */
  loading() {
    return !!this.patternImage_;
  }
  /**
   * @return {Promise<void>} `false` or a promise that resolves when the style is ready to use.
   */
  ready() {
    return this.patternImage_ ? this.patternImage_.ready() : Promise.resolve();
  }
}
function Xo(n, t, e, i) {
  return e !== void 0 && i !== void 0 ? [e / n, i / t] : e !== void 0 ? e / n : i !== void 0 ? i / t : 1;
}
class Pi extends _s {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = t.opacity !== void 0 ? t.opacity : 1, i = t.rotation !== void 0 ? t.rotation : 0, s = t.scale !== void 0 ? t.scale : 1, r = t.rotateWithView !== void 0 ? t.rotateWithView : !1;
    super({
      opacity: e,
      rotation: i,
      scale: s,
      displacement: t.displacement !== void 0 ? t.displacement : [0, 0],
      rotateWithView: r,
      declutterMode: t.declutterMode
    }), this.anchor_ = t.anchor !== void 0 ? t.anchor : [0.5, 0.5], this.normalizedAnchor_ = null, this.anchorOrigin_ = t.anchorOrigin !== void 0 ? t.anchorOrigin : "top-left", this.anchorXUnits_ = t.anchorXUnits !== void 0 ? t.anchorXUnits : "fraction", this.anchorYUnits_ = t.anchorYUnits !== void 0 ? t.anchorYUnits : "fraction", this.crossOrigin_ = t.crossOrigin !== void 0 ? t.crossOrigin : null;
    const o = t.img !== void 0 ? t.img : null;
    let a = t.src;
    $(
      !(a !== void 0 && o),
      "`image` and `src` cannot be provided at the same time"
    ), (a === void 0 || a.length === 0) && o && (a = /** @type {HTMLImageElement} */
    o.src || B(o)), $(
      a !== void 0 && a.length > 0,
      "A defined and non-empty `src` or `image` must be provided"
    ), $(
      !((t.width !== void 0 || t.height !== void 0) && t.scale !== void 0),
      "`width` or `height` cannot be provided together with `scale`"
    );
    let l;
    if (t.src !== void 0 ? l = X.IDLE : o !== void 0 && ("complete" in o ? o.complete ? l = o.src ? X.LOADED : X.IDLE : l = X.LOADING : l = X.LOADED), this.color_ = t.color !== void 0 ? Ti(t.color) : null, this.iconImage_ = Br(
      o,
      /** @type {string} */
      a,
      this.crossOrigin_,
      l,
      this.color_
    ), this.offset_ = t.offset !== void 0 ? t.offset : [0, 0], this.offsetOrigin_ = t.offsetOrigin !== void 0 ? t.offsetOrigin : "top-left", this.origin_ = null, this.size_ = t.size !== void 0 ? t.size : null, this.initialOptions_, t.width !== void 0 || t.height !== void 0) {
      let c, h;
      if (t.size)
        [c, h] = t.size;
      else {
        const u = this.getImage(1);
        if (u.width && u.height)
          c = u.width, h = u.height;
        else if (u instanceof HTMLImageElement) {
          this.initialOptions_ = t;
          const d = () => {
            if (this.unlistenImageChange(d), !this.initialOptions_)
              return;
            const f = this.iconImage_.getSize();
            this.setScale(
              Xo(
                f[0],
                f[1],
                t.width,
                t.height
              )
            );
          };
          this.listenImageChange(d);
          return;
        }
      }
      c !== void 0 && this.setScale(
        Xo(c, h, t.width, t.height)
      );
    }
  }
  /**
   * Clones the style. The underlying Image/HTMLCanvasElement is not cloned.
   * @return {Icon} The cloned style.
   * @api
   * @override
   */
  clone() {
    let t, e, i;
    return this.initialOptions_ ? (e = this.initialOptions_.width, i = this.initialOptions_.height) : (t = this.getScale(), t = Array.isArray(t) ? t.slice() : t), new Pi({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      color: this.color_ && this.color_.slice ? this.color_.slice() : this.color_ || void 0,
      crossOrigin: this.crossOrigin_,
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      opacity: this.getOpacity(),
      rotateWithView: this.getRotateWithView(),
      rotation: this.getRotation(),
      scale: t,
      width: e,
      height: i,
      size: this.size_ !== null ? this.size_.slice() : void 0,
      src: this.getSrc(),
      displacement: this.getDisplacement().slice(),
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the anchor point in pixels. The anchor determines the center point for the
   * symbolizer.
   * @return {Array<number>} Anchor.
   * @api
   * @override
   */
  getAnchor() {
    let t = this.normalizedAnchor_;
    if (!t) {
      t = this.anchor_;
      const s = this.getSize();
      if (this.anchorXUnits_ == "fraction" || this.anchorYUnits_ == "fraction") {
        if (!s)
          return null;
        t = this.anchor_.slice(), this.anchorXUnits_ == "fraction" && (t[0] *= s[0]), this.anchorYUnits_ == "fraction" && (t[1] *= s[1]);
      }
      if (this.anchorOrigin_ != "top-left") {
        if (!s)
          return null;
        t === this.anchor_ && (t = this.anchor_.slice()), (this.anchorOrigin_ == "top-right" || this.anchorOrigin_ == "bottom-right") && (t[0] = -t[0] + s[0]), (this.anchorOrigin_ == "bottom-left" || this.anchorOrigin_ == "bottom-right") && (t[1] = -t[1] + s[1]);
      }
      this.normalizedAnchor_ = t;
    }
    const e = this.getDisplacement(), i = this.getScaleArray();
    return [
      t[0] - e[0] / i[0],
      t[1] + e[1] / i[1]
    ];
  }
  /**
   * Set the anchor point. The anchor determines the center point for the
   * symbolizer.
   *
   * @param {Array<number>} anchor Anchor.
   * @api
   */
  setAnchor(t) {
    this.anchor_ = t, this.normalizedAnchor_ = null;
  }
  /**
   * Get the icon color.
   * @return {import("../color.js").Color} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the image icon.
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image or Canvas element. If the Icon
   * style was configured with `src` or with a not let loaded `img`, an `ImageBitmap` will be returned.
   * @api
   * @override
   */
  getImage(t) {
    return this.iconImage_.getImage(t);
  }
  /**
   * Get the pixel ratio.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} The pixel ratio of the image.
   * @api
   * @override
   */
  getPixelRatio(t) {
    return this.iconImage_.getPixelRatio(t);
  }
  /**
   * @return {import("../size.js").Size} Image size.
   * @override
   */
  getImageSize() {
    return this.iconImage_.getSize();
  }
  /**
   * @return {import("../ImageState.js").default} Image state.
   * @override
   */
  getImageState() {
    return this.iconImage_.getImageState();
  }
  /**
   * @return {HTMLImageElement|HTMLCanvasElement|ImageBitmap} Image element.
   * @override
   */
  getHitDetectionImage() {
    return this.iconImage_.getHitDetectionImage();
  }
  /**
   * Get the origin of the symbolizer.
   * @return {Array<number>} Origin.
   * @api
   * @override
   */
  getOrigin() {
    if (this.origin_)
      return this.origin_;
    let t = this.offset_;
    if (this.offsetOrigin_ != "top-left") {
      const e = this.getSize(), i = this.iconImage_.getSize();
      if (!e || !i)
        return null;
      t = t.slice(), (this.offsetOrigin_ == "top-right" || this.offsetOrigin_ == "bottom-right") && (t[0] = i[0] - e[0] - t[0]), (this.offsetOrigin_ == "bottom-left" || this.offsetOrigin_ == "bottom-right") && (t[1] = i[1] - e[1] - t[1]);
    }
    return this.origin_ = t, this.origin_;
  }
  /**
   * Get the image URL.
   * @return {string|undefined} Image src.
   * @api
   */
  getSrc() {
    return this.iconImage_.getSrc();
  }
  /**
   * Get the size of the icon (in pixels).
   * @return {import("../size.js").Size} Image size.
   * @api
   * @override
   */
  getSize() {
    return this.size_ ? this.size_ : this.iconImage_.getSize();
  }
  /**
   * Get the width of the icon (in pixels). Will return undefined when the icon image is not yet loaded.
   * @return {number} Icon width (in pixels).
   * @api
   */
  getWidth() {
    const t = this.getScaleArray();
    if (this.size_)
      return this.size_[0] * t[0];
    if (this.iconImage_.getImageState() == X.LOADED)
      return this.iconImage_.getSize()[0] * t[0];
  }
  /**
   * Get the height of the icon (in pixels). Will return undefined when the icon image is not yet loaded.
   * @return {number} Icon height (in pixels).
   * @api
   */
  getHeight() {
    const t = this.getScaleArray();
    if (this.size_)
      return this.size_[1] * t[1];
    if (this.iconImage_.getImageState() == X.LOADED)
      return this.iconImage_.getSize()[1] * t[1];
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size} scale Scale.
   * @api
   * @override
   */
  setScale(t) {
    delete this.initialOptions_, super.setScale(t);
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  listenImageChange(t) {
    this.iconImage_.addEventListener(z.CHANGE, t);
  }
  /**
   * Load not yet loaded URI.
   * When rendering a feature with an icon style, the vector renderer will
   * automatically call this method. However, you might want to call this
   * method yourself for preloading or other purposes.
   * @api
   * @override
   */
  load() {
    this.iconImage_.load();
  }
  /**
   * @param {function(import("../events/Event.js").default): void} listener Listener function.
   * @override
   */
  unlistenImageChange(t) {
    this.iconImage_.removeEventListener(z.CHANGE, t);
  }
  /**
   * @override
   */
  ready() {
    return this.iconImage_.ready();
  }
}
class lt {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.color_ = t.color !== void 0 ? t.color : null, this.lineCap_ = t.lineCap, this.lineDash_ = t.lineDash !== void 0 ? t.lineDash : null, this.lineDashOffset_ = t.lineDashOffset, this.lineJoin_ = t.lineJoin, this.miterLimit_ = t.miterLimit, this.width_ = t.width;
  }
  /**
   * Clones the style.
   * @return {Stroke} The cloned style.
   * @api
   */
  clone() {
    const t = this.getColor();
    return new lt({
      color: Array.isArray(t) ? t.slice() : t || void 0,
      lineCap: this.getLineCap(),
      lineDash: this.getLineDash() ? this.getLineDash().slice() : void 0,
      lineDashOffset: this.getLineDashOffset(),
      lineJoin: this.getLineJoin(),
      miterLimit: this.getMiterLimit(),
      width: this.getWidth()
    });
  }
  /**
   * Get the stroke color.
   * @return {import("../color.js").Color|import("../colorlike.js").ColorLike} Color.
   * @api
   */
  getColor() {
    return this.color_;
  }
  /**
   * Get the line cap type for the stroke.
   * @return {CanvasLineCap|undefined} Line cap.
   * @api
   */
  getLineCap() {
    return this.lineCap_;
  }
  /**
   * Get the line dash style for the stroke.
   * @return {Array<number>|null} Line dash.
   * @api
   */
  getLineDash() {
    return this.lineDash_;
  }
  /**
   * Get the line dash offset for the stroke.
   * @return {number|undefined} Line dash offset.
   * @api
   */
  getLineDashOffset() {
    return this.lineDashOffset_;
  }
  /**
   * Get the line join type for the stroke.
   * @return {CanvasLineJoin|undefined} Line join.
   * @api
   */
  getLineJoin() {
    return this.lineJoin_;
  }
  /**
   * Get the miter limit for the stroke.
   * @return {number|undefined} Miter limit.
   * @api
   */
  getMiterLimit() {
    return this.miterLimit_;
  }
  /**
   * Get the stroke width.
   * @return {number|undefined} Width.
   * @api
   */
  getWidth() {
    return this.width_;
  }
  /**
   * Set the color.
   *
   * @param {import("../color.js").Color|import("../colorlike.js").ColorLike} color Color.
   * @api
   */
  setColor(t) {
    this.color_ = t;
  }
  /**
   * Set the line cap.
   *
   * @param {CanvasLineCap|undefined} lineCap Line cap.
   * @api
   */
  setLineCap(t) {
    this.lineCap_ = t;
  }
  /**
   * Set the line dash.
   *
   * @param {Array<number>|null} lineDash Line dash.
   * @api
   */
  setLineDash(t) {
    this.lineDash_ = t;
  }
  /**
   * Set the line dash offset.
   *
   * @param {number|undefined} lineDashOffset Line dash offset.
   * @api
   */
  setLineDashOffset(t) {
    this.lineDashOffset_ = t;
  }
  /**
   * Set the line join.
   *
   * @param {CanvasLineJoin|undefined} lineJoin Line join.
   * @api
   */
  setLineJoin(t) {
    this.lineJoin_ = t;
  }
  /**
   * Set the miter limit.
   *
   * @param {number|undefined} miterLimit Miter limit.
   * @api
   */
  setMiterLimit(t) {
    this.miterLimit_ = t;
  }
  /**
   * Set the width.
   *
   * @param {number|undefined} width Width.
   * @api
   */
  setWidth(t) {
    this.width_ = t;
  }
}
class rt {
  /**
   * @param {Options} [options] Style options.
   */
  constructor(t) {
    t = t || {}, this.geometry_ = null, this.geometryFunction_ = Yo, t.geometry !== void 0 && this.setGeometry(t.geometry), this.fill_ = t.fill !== void 0 ? t.fill : null, this.image_ = t.image !== void 0 ? t.image : null, this.renderer_ = t.renderer !== void 0 ? t.renderer : null, this.hitDetectionRenderer_ = t.hitDetectionRenderer !== void 0 ? t.hitDetectionRenderer : null, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.text_ = t.text !== void 0 ? t.text : null, this.zIndex_ = t.zIndex;
  }
  /**
   * Clones the style.
   * @return {Style} The cloned style.
   * @api
   */
  clone() {
    let t = this.getGeometry();
    return t && typeof t == "object" && (t = /** @type {import("../geom/Geometry.js").default} */
    t.clone()), new rt({
      geometry: t ?? void 0,
      fill: this.getFill() ? this.getFill().clone() : void 0,
      image: this.getImage() ? this.getImage().clone() : void 0,
      renderer: this.getRenderer() ?? void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      text: this.getText() ? this.getText().clone() : void 0,
      zIndex: this.getZIndex()
    });
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setRenderer} or the `renderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Sets a custom renderer function for this style. When set, `fill`, `stroke`
   * and `image` options of the style will be ignored.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setRenderer(t) {
    this.renderer_ = t;
  }
  /**
   * Sets a custom renderer function for this style used
   * in hit detection.
   * @param {RenderFunction|null} renderer Custom renderer function.
   * @api
   */
  setHitDetectionRenderer(t) {
    this.hitDetectionRenderer_ = t;
  }
  /**
   * Get the custom renderer function that was configured with
   * {@link #setHitDetectionRenderer} or the `hitDetectionRenderer` constructor option.
   * @return {RenderFunction|null} Custom renderer function.
   * @api
   */
  getHitDetectionRenderer() {
    return this.hitDetectionRenderer_;
  }
  /**
   * Get the geometry to be rendered.
   * @return {string|import("../geom/Geometry.js").default|GeometryFunction|null}
   * Feature property or geometry or function that returns the geometry that will
   * be rendered with this style.
   * @api
   */
  getGeometry() {
    return this.geometry_;
  }
  /**
   * Get the function used to generate a geometry for rendering.
   * @return {!GeometryFunction} Function that is called with a feature
   * and returns the geometry to render instead of the feature's geometry.
   * @api
   */
  getGeometryFunction() {
    return this.geometryFunction_;
  }
  /**
   * Get the fill style.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Set the fill style.
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t;
  }
  /**
   * Get the image style.
   * @return {import("./Image.js").default|null} Image style.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Set the image style.
   * @param {import("./Image.js").default} image Image style.
   * @api
   */
  setImage(t) {
    this.image_ = t;
  }
  /**
   * Get the stroke style.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Set the stroke style.
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t;
  }
  /**
   * Get the text style.
   * @return {import("./Text.js").default|null} Text style.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Set the text style.
   * @param {import("./Text.js").default} text Text style.
   * @api
   */
  setText(t) {
    this.text_ = t;
  }
  /**
   * Get the z-index for the style.
   * @return {number|undefined} ZIndex.
   * @api
   */
  getZIndex() {
    return this.zIndex_;
  }
  /**
   * Set a geometry that is rendered instead of the feature's geometry.
   *
   * @param {string|import("../geom/Geometry.js").default|GeometryFunction|null} geometry
   *     Feature property or geometry or function returning a geometry to render
   *     for this style.
   * @api
   */
  setGeometry(t) {
    typeof t == "function" ? this.geometryFunction_ = t : typeof t == "string" ? this.geometryFunction_ = function(e) {
      return (
        /** @type {import("../geom/Geometry.js").default} */
        e.get(t)
      );
    } : t ? t !== void 0 && (this.geometryFunction_ = function() {
      return (
        /** @type {import("../geom/Geometry.js").default} */
        t
      );
    }) : this.geometryFunction_ = Yo, this.geometry_ = t;
  }
  /**
   * Set the z-index.
   *
   * @param {number|undefined} zIndex ZIndex.
   * @api
   */
  setZIndex(t) {
    this.zIndex_ = t;
  }
}
function $u(n) {
  let t;
  if (typeof n == "function")
    t = n;
  else {
    let e;
    Array.isArray(n) ? e = n : ($(
      typeof /** @type {?} */
      n.getZIndex == "function",
      "Expected an `Style` or an array of `Style`"
    ), e = [
      /** @type {Style} */
      n
    ]), t = function() {
      return e;
    };
  }
  return t;
}
let Ks = null;
function dl(n, t) {
  if (!Ks) {
    const e = new ht({
      color: "rgba(255,255,255,0.4)"
    }), i = new lt({
      color: "#3399CC",
      width: 1.25
    });
    Ks = [
      new rt({
        image: new qt({
          fill: e,
          stroke: i,
          radius: 5
        }),
        fill: e,
        stroke: i
      })
    ];
  }
  return Ks;
}
function qu() {
  const n = {}, t = [255, 255, 255, 1], e = [0, 153, 255, 1], i = 3;
  return n.Polygon = [
    new rt({
      fill: new ht({
        color: [255, 255, 255, 0.5]
      })
    })
  ], n.MultiPolygon = n.Polygon, n.LineString = [
    new rt({
      stroke: new lt({
        color: t,
        width: i + 2
      })
    }),
    new rt({
      stroke: new lt({
        color: e,
        width: i
      })
    })
  ], n.MultiLineString = n.LineString, n.Circle = n.Polygon.concat(n.LineString), n.Point = [
    new rt({
      image: new qt({
        radius: i * 2,
        fill: new ht({
          color: e
        }),
        stroke: new lt({
          color: t,
          width: i / 2
        })
      }),
      zIndex: 1 / 0
    })
  ], n.MultiPoint = n.Point, n.GeometryCollection = n.Polygon.concat(
    n.LineString,
    n.Point
  ), n;
}
function Yo(n) {
  return n.getGeometry();
}
const Ju = "#333";
class Ee {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    t = t || {}, this.font_ = t.font, this.rotation_ = t.rotation, this.rotateWithView_ = t.rotateWithView, this.keepUpright_ = t.keepUpright, this.scale_ = t.scale, this.scaleArray_ = Lt(t.scale !== void 0 ? t.scale : 1), this.text_ = t.text, this.textAlign_ = t.textAlign, this.justify_ = t.justify, this.repeat_ = t.repeat, this.textBaseline_ = t.textBaseline, this.fill_ = t.fill !== void 0 ? t.fill : new ht({ color: Ju }), this.maxAngle_ = t.maxAngle !== void 0 ? t.maxAngle : Math.PI / 4, this.placement_ = t.placement !== void 0 ? t.placement : "point", this.overflow_ = !!t.overflow, this.stroke_ = t.stroke !== void 0 ? t.stroke : null, this.offsetX_ = t.offsetX !== void 0 ? t.offsetX : 0, this.offsetY_ = t.offsetY !== void 0 ? t.offsetY : 0, this.backgroundFill_ = t.backgroundFill ? t.backgroundFill : null, this.backgroundStroke_ = t.backgroundStroke ? t.backgroundStroke : null, this.padding_ = t.padding === void 0 ? null : t.padding, this.declutterMode_ = t.declutterMode;
  }
  /**
   * Clones the style.
   * @return {Text} The cloned style.
   * @api
   */
  clone() {
    const t = this.getScale();
    return new Ee({
      font: this.getFont(),
      placement: this.getPlacement(),
      repeat: this.getRepeat(),
      maxAngle: this.getMaxAngle(),
      overflow: this.getOverflow(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
      keepUpright: this.getKeepUpright(),
      scale: Array.isArray(t) ? t.slice() : t,
      text: this.getText(),
      textAlign: this.getTextAlign(),
      justify: this.getJustify(),
      textBaseline: this.getTextBaseline(),
      fill: this.getFill() ? this.getFill().clone() : void 0,
      stroke: this.getStroke() ? this.getStroke().clone() : void 0,
      offsetX: this.getOffsetX(),
      offsetY: this.getOffsetY(),
      backgroundFill: this.getBackgroundFill() ? this.getBackgroundFill().clone() : void 0,
      backgroundStroke: this.getBackgroundStroke() ? this.getBackgroundStroke().clone() : void 0,
      padding: this.getPadding() || void 0,
      declutterMode: this.getDeclutterMode()
    });
  }
  /**
   * Get the `overflow` configuration.
   * @return {boolean} Let text overflow the length of the path they follow.
   * @api
   */
  getOverflow() {
    return this.overflow_;
  }
  /**
   * Get the font name.
   * @return {string|undefined} Font.
   * @api
   */
  getFont() {
    return this.font_;
  }
  /**
   * Get the maximum angle between adjacent characters.
   * @return {number} Angle in radians.
   * @api
   */
  getMaxAngle() {
    return this.maxAngle_;
  }
  /**
   * Get the label placement.
   * @return {TextPlacement} Text placement.
   * @api
   */
  getPlacement() {
    return this.placement_;
  }
  /**
   * Get the repeat interval of the text.
   * @return {number|undefined} Repeat interval in pixels.
   * @api
   */
  getRepeat() {
    return this.repeat_;
  }
  /**
   * Get the x-offset for the text.
   * @return {number} Horizontal text offset.
   * @api
   */
  getOffsetX() {
    return this.offsetX_;
  }
  /**
   * Get the y-offset for the text.
   * @return {number} Vertical text offset.
   * @api
   */
  getOffsetY() {
    return this.offsetY_;
  }
  /**
   * Get the fill style for the text.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getFill() {
    return this.fill_;
  }
  /**
   * Determine whether the text rotates with the map.
   * @return {boolean|undefined} Rotate with map.
   * @api
   */
  getRotateWithView() {
    return this.rotateWithView_;
  }
  /**
   * Determine whether the text can be rendered upside down.
   * @return {boolean|undefined} Keep text upright.
   * @api
   */
  getKeepUpright() {
    return this.keepUpright_;
  }
  /**
   * Get the text rotation.
   * @return {number|undefined} Rotation.
   * @api
   */
  getRotation() {
    return this.rotation_;
  }
  /**
   * Get the text scale.
   * @return {number|import("../size.js").Size|undefined} Scale.
   * @api
   */
  getScale() {
    return this.scale_;
  }
  /**
   * Get the symbolizer scale array.
   * @return {import("../size.js").Size} Scale array.
   */
  getScaleArray() {
    return this.scaleArray_;
  }
  /**
   * Get the stroke style for the text.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getStroke() {
    return this.stroke_;
  }
  /**
   * Get the text to be rendered.
   * @return {string|Array<string>|undefined} Text.
   * @api
   */
  getText() {
    return this.text_;
  }
  /**
   * Get the text alignment.
   * @return {CanvasTextAlign|undefined} Text align.
   * @api
   */
  getTextAlign() {
    return this.textAlign_;
  }
  /**
   * Get the justification.
   * @return {TextJustify|undefined} Justification.
   * @api
   */
  getJustify() {
    return this.justify_;
  }
  /**
   * Get the text baseline.
   * @return {CanvasTextBaseline|undefined} Text baseline.
   * @api
   */
  getTextBaseline() {
    return this.textBaseline_;
  }
  /**
   * Get the background fill style for the text.
   * @return {import("./Fill.js").default|null} Fill style.
   * @api
   */
  getBackgroundFill() {
    return this.backgroundFill_;
  }
  /**
   * Get the background stroke style for the text.
   * @return {import("./Stroke.js").default|null} Stroke style.
   * @api
   */
  getBackgroundStroke() {
    return this.backgroundStroke_;
  }
  /**
   * Get the padding for the text.
   * @return {Array<number>|null} Padding.
   * @api
   */
  getPadding() {
    return this.padding_;
  }
  /**
   * Get the declutter mode of the shape
   * @return {import("./Style.js").DeclutterMode} Shape's declutter mode
   * @api
   */
  getDeclutterMode() {
    return this.declutterMode_;
  }
  /**
   * Set the `overflow` property.
   *
   * @param {boolean} overflow Let text overflow the path that it follows.
   * @api
   */
  setOverflow(t) {
    this.overflow_ = t;
  }
  /**
   * Set the font.
   *
   * @param {string|undefined} font Font.
   * @api
   */
  setFont(t) {
    this.font_ = t;
  }
  /**
   * Set the maximum angle between adjacent characters.
   *
   * @param {number} maxAngle Angle in radians.
   * @api
   */
  setMaxAngle(t) {
    this.maxAngle_ = t;
  }
  /**
   * Set the x offset.
   *
   * @param {number} offsetX Horizontal text offset.
   * @api
   */
  setOffsetX(t) {
    this.offsetX_ = t;
  }
  /**
   * Set the y offset.
   *
   * @param {number} offsetY Vertical text offset.
   * @api
   */
  setOffsetY(t) {
    this.offsetY_ = t;
  }
  /**
   * Set the text placement.
   *
   * @param {TextPlacement} placement Placement.
   * @api
   */
  setPlacement(t) {
    this.placement_ = t;
  }
  /**
   * Set the repeat interval of the text.
   * @param {number|undefined} [repeat] Repeat interval in pixels.
   * @api
   */
  setRepeat(t) {
    this.repeat_ = t;
  }
  /**
   * Set whether to rotate the text with the view.
   *
   * @param {boolean} rotateWithView Rotate with map.
   * @api
   */
  setRotateWithView(t) {
    this.rotateWithView_ = t;
  }
  /**
   * Set whether the text can be rendered upside down.
   *
   * @param {boolean} keepUpright Keep text upright.
   * @api
   */
  setKeepUpright(t) {
    this.keepUpright_ = t;
  }
  /**
   * Set the fill.
   *
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setFill(t) {
    this.fill_ = t;
  }
  /**
   * Set the rotation.
   *
   * @param {number|undefined} rotation Rotation.
   * @api
   */
  setRotation(t) {
    this.rotation_ = t;
  }
  /**
   * Set the scale.
   *
   * @param {number|import("../size.js").Size|undefined} scale Scale.
   * @api
   */
  setScale(t) {
    this.scale_ = t, this.scaleArray_ = Lt(t !== void 0 ? t : 1);
  }
  /**
   * Set the stroke.
   *
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setStroke(t) {
    this.stroke_ = t;
  }
  /**
   * Set the text.
   *
   * @param {string|Array<string>|undefined} text Text.
   * @api
   */
  setText(t) {
    this.text_ = t;
  }
  /**
   * Set the text alignment.
   *
   * @param {CanvasTextAlign|undefined} textAlign Text align.
   * @api
   */
  setTextAlign(t) {
    this.textAlign_ = t;
  }
  /**
   * Set the justification.
   *
   * @param {TextJustify|undefined} justify Justification.
   * @api
   */
  setJustify(t) {
    this.justify_ = t;
  }
  /**
   * Set the text baseline.
   *
   * @param {CanvasTextBaseline|undefined} textBaseline Text baseline.
   * @api
   */
  setTextBaseline(t) {
    this.textBaseline_ = t;
  }
  /**
   * Set the background fill.
   *
   * @param {import("./Fill.js").default|null} fill Fill style.
   * @api
   */
  setBackgroundFill(t) {
    this.backgroundFill_ = t;
  }
  /**
   * Set the background stroke.
   *
   * @param {import("./Stroke.js").default|null} stroke Stroke style.
   * @api
   */
  setBackgroundStroke(t) {
    this.backgroundStroke_ = t;
  }
  /**
   * Set the padding (`[top, right, bottom, left]`).
   *
   * @param {Array<number>|null} padding Padding.
   * @api
   */
  setPadding(t) {
    this.padding_ = t;
  }
}
function Qu(n) {
  return !0;
}
function td(n) {
  const t = ol(), e = ed(n, t), i = ll();
  return function(s, r) {
    if (i.properties = s.getPropertiesInternal(), i.resolution = r, t.featureId) {
      const o = s.getId();
      o !== void 0 ? i.featureId = o : i.featureId = null;
    }
    return t.geometryType && (i.geometryType = al(
      s.getGeometry()
    )), e(i);
  };
}
function Ko(n) {
  const t = ol(), e = n.length, i = new Array(e);
  for (let o = 0; o < e; ++o)
    i[o] = ur(n[o], t);
  const s = ll(), r = new Array(e);
  return function(o, a) {
    if (s.properties = o.getPropertiesInternal(), s.resolution = a, t.featureId) {
      const c = o.getId();
      c !== void 0 ? s.featureId = c : s.featureId = null;
    }
    let l = 0;
    for (let c = 0; c < e; ++c) {
      const h = i[c](s);
      h && (r[l] = h, l += 1);
    }
    return r.length = l, r;
  };
}
function ed(n, t) {
  const e = n.length, i = new Array(e);
  for (let s = 0; s < e; ++s) {
    const r = n[s], o = "filter" in r ? ye(r.filter, Ct, t) : Qu;
    let a;
    if (Array.isArray(r.style)) {
      const l = r.style.length;
      a = new Array(l);
      for (let c = 0; c < l; ++c)
        a[c] = ur(r.style[c], t);
    } else
      a = [ur(r.style, t)];
    i[s] = { filter: o, styles: a };
  }
  return function(s) {
    const r = [];
    let o = !1;
    for (let a = 0; a < e; ++a) {
      const l = i[a].filter;
      if (l(s) && !(n[a].else && o)) {
        o = !0;
        for (const c of i[a].styles) {
          const h = c(s);
          h && r.push(h);
        }
      }
    }
    return r;
  };
}
function ur(n, t) {
  const e = hn(n, "", t), i = cn(n, "", t), s = id(n, t), r = nd(n, t), o = vt(n, "z-index", t);
  if (!e && !i && !s && !r && !Ci(n))
    throw new Error(
      "No fill, stroke, point, or text symbolizer properties in style: " + JSON.stringify(n)
    );
  const a = new rt();
  return function(l) {
    let c = !0;
    if (e) {
      const h = e(l);
      h && (c = !1), a.setFill(h);
    }
    if (i) {
      const h = i(l);
      h && (c = !1), a.setStroke(h);
    }
    if (s) {
      const h = s(l);
      h && (c = !1), a.setText(h);
    }
    if (r) {
      const h = r(l);
      h && (c = !1), a.setImage(h);
    }
    return o && a.setZIndex(o(l)), c ? null : a;
  };
}
function hn(n, t, e) {
  let i;
  if (t + "fill-pattern-src" in n)
    i = ad(n, t + "fill-", e);
  else {
    if (n[t + "fill-color"] === "none")
      return (r) => null;
    i = Vr(
      n,
      t + "fill-color",
      e
    );
  }
  if (!i)
    return null;
  const s = new ht();
  return function(r) {
    const o = i(r);
    return o === Wr ? null : (s.setColor(o), s);
  };
}
function cn(n, t, e) {
  const i = vt(
    n,
    t + "stroke-width",
    e
  ), s = Vr(
    n,
    t + "stroke-color",
    e
  );
  if (!i && !s)
    return null;
  const r = fe(
    n,
    t + "stroke-line-cap",
    e
  ), o = fe(
    n,
    t + "stroke-line-join",
    e
  ), a = fl(
    n,
    t + "stroke-line-dash",
    e
  ), l = vt(
    n,
    t + "stroke-line-dash-offset",
    e
  ), c = vt(
    n,
    t + "stroke-miter-limit",
    e
  ), h = new lt();
  return function(u) {
    if (s) {
      const d = s(u);
      if (d === Wr)
        return null;
      h.setColor(d);
    }
    if (i && h.setWidth(i(u)), r) {
      const d = r(u);
      if (d !== "butt" && d !== "round" && d !== "square")
        throw new Error("Expected butt, round, or square line cap");
      h.setLineCap(d);
    }
    if (o) {
      const d = o(u);
      if (d !== "bevel" && d !== "round" && d !== "miter")
        throw new Error("Expected bevel, round, or miter line join");
      h.setLineJoin(d);
    }
    return a && h.setLineDash(a(u)), l && h.setLineDashOffset(l(u)), c && h.setMiterLimit(c(u)), h;
  };
}
function id(n, t) {
  const e = "text-", i = fe(n, e + "value", t);
  if (!i)
    return null;
  const s = hn(n, e, t), r = hn(
    n,
    e + "background-",
    t
  ), o = cn(n, e, t), a = cn(
    n,
    e + "background-",
    t
  ), l = fe(n, e + "font", t), c = vt(
    n,
    e + "max-angle",
    t
  ), h = vt(
    n,
    e + "offset-x",
    t
  ), u = vt(
    n,
    e + "offset-y",
    t
  ), d = Ei(
    n,
    e + "overflow",
    t
  ), f = fe(
    n,
    e + "placement",
    t
  ), g = vt(n, e + "repeat", t), m = ps(n, e + "scale", t), _ = Ei(
    n,
    e + "rotate-with-view",
    t
  ), p = vt(
    n,
    e + "rotation",
    t
  ), E = fe(n, e + "align", t), w = fe(
    n,
    e + "justify",
    t
  ), y = fe(
    n,
    e + "baseline",
    t
  ), x = Ei(
    n,
    e + "keep-upright",
    t
  ), R = fl(
    n,
    e + "padding",
    t
  ), T = ys(
    n,
    e + "declutter-mode"
  ), S = new Ee({ declutterMode: T });
  return function(v) {
    if (S.setText(i(v)), s && S.setFill(s(v)), r && S.setBackgroundFill(r(v)), o && S.setStroke(o(v)), a && S.setBackgroundStroke(a(v)), l && S.setFont(l(v)), c && S.setMaxAngle(c(v)), h && S.setOffsetX(h(v)), u && S.setOffsetY(u(v)), d && S.setOverflow(d(v)), f) {
      const L = f(v);
      if (L !== "point" && L !== "line")
        throw new Error("Expected point or line for text-placement");
      S.setPlacement(L);
    }
    if (g && S.setRepeat(g(v)), m && S.setScale(m(v)), _ && S.setRotateWithView(_(v)), p && S.setRotation(p(v)), E) {
      const L = E(v);
      if (L !== "left" && L !== "center" && L !== "right" && L !== "end" && L !== "start")
        throw new Error(
          "Expected left, right, center, start, or end for text-align"
        );
      S.setTextAlign(L);
    }
    if (w) {
      const L = w(v);
      if (L !== "left" && L !== "right" && L !== "center")
        throw new Error("Expected left, right, or center for text-justify");
      S.setJustify(L);
    }
    if (y) {
      const L = y(v);
      if (L !== "bottom" && L !== "top" && L !== "middle" && L !== "alphabetic" && L !== "hanging")
        throw new Error(
          "Expected bottom, top, middle, alphabetic, or hanging for text-baseline"
        );
      S.setTextBaseline(L);
    }
    return R && S.setPadding(R(v)), x && S.setKeepUpright(x(v)), S;
  };
}
function nd(n, t) {
  return "icon-src" in n ? sd(n, t) : "shape-points" in n ? rd(n, t) : "circle-radius" in n ? od(n, t) : null;
}
function sd(n, t) {
  const e = "icon-", i = e + "src", s = gl(n[i], i), r = Hn(
    n,
    e + "anchor",
    t
  ), o = ps(n, e + "scale", t), a = vt(
    n,
    e + "opacity",
    t
  ), l = Hn(
    n,
    e + "displacement",
    t
  ), c = vt(
    n,
    e + "rotation",
    t
  ), h = Ei(
    n,
    e + "rotate-with-view",
    t
  ), u = Vo(n, e + "anchor-origin"), d = Zo(
    n,
    e + "anchor-x-units"
  ), f = Zo(
    n,
    e + "anchor-y-units"
  ), g = ud(n, e + "color"), m = hd(n, e + "cross-origin"), _ = cd(n, e + "offset"), p = Vo(n, e + "offset-origin"), E = $n(n, e + "width"), w = $n(n, e + "height"), y = ld(n, e + "size"), x = ys(
    n,
    e + "declutter-mode"
  ), R = new Pi({
    src: s,
    anchorOrigin: u,
    anchorXUnits: d,
    anchorYUnits: f,
    color: g,
    crossOrigin: m,
    offset: _,
    offsetOrigin: p,
    height: w,
    width: E,
    size: y,
    declutterMode: x
  });
  return function(T) {
    return a && R.setOpacity(a(T)), l && R.setDisplacement(l(T)), c && R.setRotation(c(T)), h && R.setRotateWithView(h(T)), o && R.setScale(o(T)), r && R.setAnchor(r(T)), R;
  };
}
function rd(n, t) {
  const e = "shape-", i = e + "points", s = e + "radius", r = dr(n[i], i), o = dr(n[s], s), a = hn(n, e, t), l = cn(n, e, t), c = ps(n, e + "scale", t), h = Hn(
    n,
    e + "displacement",
    t
  ), u = vt(
    n,
    e + "rotation",
    t
  ), d = Ei(
    n,
    e + "rotate-with-view",
    t
  ), f = $n(n, e + "radius2"), g = $n(n, e + "angle"), m = ys(
    n,
    e + "declutter-mode"
  ), _ = new ms({
    points: r,
    radius: o,
    radius2: f,
    angle: g,
    declutterMode: m
  });
  return function(p) {
    return a && _.setFill(a(p)), l && _.setStroke(l(p)), h && _.setDisplacement(h(p)), u && _.setRotation(u(p)), d && _.setRotateWithView(d(p)), c && _.setScale(c(p)), _;
  };
}
function od(n, t) {
  const e = "circle-", i = hn(n, e, t), s = cn(n, e, t), r = vt(n, e + "radius", t), o = ps(n, e + "scale", t), a = Hn(
    n,
    e + "displacement",
    t
  ), l = vt(
    n,
    e + "rotation",
    t
  ), c = Ei(
    n,
    e + "rotate-with-view",
    t
  ), h = ys(
    n,
    e + "declutter-mode"
  ), u = new qt({
    radius: 5,
    // this is arbitrary, but required - the evaluated radius is used below
    declutterMode: h
  });
  return function(d) {
    return r && u.setRadius(r(d)), i && u.setFill(i(d)), s && u.setStroke(s(d)), a && u.setDisplacement(a(d)), l && u.setRotation(l(d)), c && u.setRotateWithView(c(d)), o && u.setScale(o(d)), u;
  };
}
function vt(n, t, e) {
  if (!(t in n))
    return;
  const i = ye(n[t], Z, e);
  return function(s) {
    return dr(i(s), t);
  };
}
function fe(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(n[t], St, e);
  return function(s) {
    return gl(i(s), t);
  };
}
function ad(n, t, e) {
  const i = fe(
    n,
    t + "pattern-src",
    e
  ), s = Bo(
    n,
    t + "pattern-offset",
    e
  ), r = Bo(
    n,
    t + "pattern-size",
    e
  ), o = Vr(
    n,
    t + "color",
    e
  );
  return function(a) {
    return {
      src: i(a),
      offset: s && s(a),
      size: r && r(a),
      color: o && o(a)
    };
  };
}
function Ei(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(n[t], Ct, e);
  return function(s) {
    const r = i(s);
    if (typeof r != "boolean")
      throw new Error(`Expected a boolean for ${t}`);
    return r;
  };
}
function Vr(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(n[t], Zt, e);
  return function(s) {
    return _l(i(s), t);
  };
}
function fl(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(n[t], He, e);
  return function(s) {
    return pn(i(s), t);
  };
}
function Hn(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(n[t], He, e);
  return function(s) {
    const r = pn(i(s), t);
    if (r.length !== 2)
      throw new Error(`Expected two numbers for ${t}`);
    return r;
  };
}
function Bo(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(n[t], He, e);
  return function(s) {
    return ml(i(s), t);
  };
}
function ps(n, t, e) {
  if (!(t in n))
    return null;
  const i = ye(
    n[t],
    He | Z,
    e
  );
  return function(s) {
    return dd(i(s), t);
  };
}
function $n(n, t) {
  const e = n[t];
  if (e !== void 0) {
    if (typeof e != "number")
      throw new Error(`Expected a number for ${t}`);
    return e;
  }
}
function ld(n, t) {
  const e = n[t];
  if (e !== void 0) {
    if (typeof e == "number")
      return Lt(e);
    if (!Array.isArray(e))
      throw new Error(`Expected a number or size array for ${t}`);
    if (e.length !== 2 || typeof e[0] != "number" || typeof e[1] != "number")
      throw new Error(`Expected a number or size array for ${t}`);
    return e;
  }
}
function hd(n, t) {
  const e = n[t];
  if (e !== void 0) {
    if (typeof e != "string")
      throw new Error(`Expected a string for ${t}`);
    return e;
  }
}
function Vo(n, t) {
  const e = n[t];
  if (e !== void 0) {
    if (e !== "bottom-left" && e !== "bottom-right" && e !== "top-left" && e !== "top-right")
      throw new Error(
        `Expected bottom-left, bottom-right, top-left, or top-right for ${t}`
      );
    return e;
  }
}
function Zo(n, t) {
  const e = n[t];
  if (e !== void 0) {
    if (e !== "pixels" && e !== "fraction")
      throw new Error(`Expected pixels or fraction for ${t}`);
    return e;
  }
}
function cd(n, t) {
  const e = n[t];
  if (e !== void 0)
    return pn(e, t);
}
function ys(n, t) {
  const e = n[t];
  if (e !== void 0) {
    if (typeof e != "string")
      throw new Error(`Expected a string for ${t}`);
    if (e !== "declutter" && e !== "obstacle" && e !== "none")
      throw new Error(`Expected declutter, obstacle, or none for ${t}`);
    return e;
  }
}
function ud(n, t) {
  const e = n[t];
  if (e !== void 0)
    return _l(e, t);
}
function pn(n, t) {
  if (!Array.isArray(n))
    throw new Error(`Expected an array for ${t}`);
  const e = n.length;
  for (let i = 0; i < e; ++i)
    if (typeof n[i] != "number")
      throw new Error(`Expected an array of numbers for ${t}`);
  return n;
}
function gl(n, t) {
  if (typeof n != "string")
    throw new Error(`Expected a string for ${t}`);
  return n;
}
function dr(n, t) {
  if (typeof n != "number")
    throw new Error(`Expected a number for ${t}`);
  return n;
}
function _l(n, t) {
  if (typeof n == "string")
    return n;
  const e = pn(n, t), i = e.length;
  if (i < 3 || i > 4)
    throw new Error(`Expected a color with 3 or 4 values for ${t}`);
  return e;
}
function ml(n, t) {
  const e = pn(n, t);
  if (e.length !== 2)
    throw new Error(`Expected an array of two numbers for ${t}`);
  return e;
}
function dd(n, t) {
  return typeof n == "number" ? n : ml(n, t);
}
const Uo = {
  RENDER_ORDER: "renderOrder"
};
class pl extends gs {
  /**
   * @param {Options<FeatureType, VectorSourceType>} [options] Options.
   */
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t);
    delete e.style, delete e.renderBuffer, delete e.updateWhileAnimating, delete e.updateWhileInteracting, super(e), this.declutter_ = t.declutter ? String(t.declutter) : void 0, this.renderBuffer_ = t.renderBuffer !== void 0 ? t.renderBuffer : 100, this.style_ = null, this.styleFunction_ = void 0, this.setStyle(t.style), this.updateWhileAnimating_ = t.updateWhileAnimating !== void 0 ? t.updateWhileAnimating : !1, this.updateWhileInteracting_ = t.updateWhileInteracting !== void 0 ? t.updateWhileInteracting : !1;
  }
  /**
   * @return {string} Declutter group.
   * @override
   */
  getDeclutter() {
    return this.declutter_;
  }
  /**
   * Get the topmost feature that intersects the given pixel on the viewport. Returns a promise
   * that resolves with an array of features. The array will either contain the topmost feature
   * when a hit was detected, or it will be empty.
   *
   * The hit detection algorithm used for this method is optimized for performance, but is less
   * accurate than the one used in [map.getFeaturesAtPixel()]{@link import("../Map.js").default#getFeaturesAtPixel}.
   * Text is not considered, and icons are only represented by their bounding box instead of the exact
   * image.
   *
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with an array of features.
   * @api
   * @override
   */
  getFeatures(t) {
    return super.getFeatures(t);
  }
  /**
   * @return {number|undefined} Render buffer.
   */
  getRenderBuffer() {
    return this.renderBuffer_;
  }
  /**
   * @return {import("../render.js").OrderFunction|null|undefined} Render order.
   */
  getRenderOrder() {
    return (
      /** @type {import("../render.js").OrderFunction|null|undefined} */
      this.get(Uo.RENDER_ORDER)
    );
  }
  /**
   * Get the style for features.  This returns whatever was passed to the `style`
   * option at construction or to the `setStyle` method.
   * @return {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null|undefined} Layer style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the style function.
   * @return {import("../style/Style.js").StyleFunction|undefined} Layer style function.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     animating.
   */
  getUpdateWhileAnimating() {
    return this.updateWhileAnimating_;
  }
  /**
   * @return {boolean} Whether the rendered layer should be updated while
   *     interacting.
   */
  getUpdateWhileInteracting() {
    return this.updateWhileInteracting_;
  }
  /**
   * Render declutter items for this layer
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {import("../layer/Layer.js").State} layerState Layer state.
   * @override
   */
  renderDeclutter(t, e) {
    const i = this.getDeclutter();
    i in t.declutter || (t.declutter[i] = new sl(9)), this.getRenderer().renderDeclutter(t, e);
  }
  /**
   * @param {import("../render.js").OrderFunction|null|undefined} renderOrder
   *     Render order.
   */
  setRenderOrder(t) {
    this.set(Uo.RENDER_ORDER, t);
  }
  /**
   * Set the style for features.  This can be a single style object, an array
   * of styles, or a function that takes a feature and resolution and returns
   * an array of styles. If set to `null`, the layer has no style (a `null` style),
   * so only features that have their own styles will be rendered in the layer. Call
   * `setStyle()` without arguments to reset to the default style. See
   * [the ol/style/Style module]{@link module:ol/style/Style~Style} for information on the default style.
   *
   * If your layer has a static style, you can use [flat style]{@link module:ol/style/flat~FlatStyle} object
   * literals instead of using the `Style` and symbolizer constructors (`Fill`, `Stroke`, etc.):
   * ```js
   * vectorLayer.setStyle({
   *   "fill-color": "yellow",
   *   "stroke-color": "black",
   *   "stroke-width": 4
   * })
   * ```
   *
   * @param {import("../style/Style.js").StyleLike|import("../style/flat.js").FlatStyleLike|null} [style] Layer style.
   * @api
   */
  setStyle(t) {
    this.style_ = t === void 0 ? dl : t;
    const e = fd(t);
    this.styleFunction_ = t === null ? void 0 : $u(e), this.changed();
  }
  /**
   * @param {boolean|string|number} declutter Declutter images and text.
   * @api
   */
  setDeclutter(t) {
    this.declutter_ = t ? String(t) : void 0, this.changed();
  }
}
function fd(n) {
  if (n === void 0)
    return dl;
  if (!n)
    return null;
  if (typeof n == "function" || n instanceof rt)
    return n;
  if (!Array.isArray(n))
    return Ko([n]);
  if (n.length === 0)
    return [];
  const t = n.length, e = n[0];
  if (e instanceof rt) {
    const s = new Array(t);
    for (let r = 0; r < t; ++r) {
      const o = n[r];
      if (!(o instanceof rt))
        throw new Error("Expected a list of style instances");
      s[r] = o;
    }
    return s;
  }
  if ("style" in e) {
    const s = new Array(t);
    for (let r = 0; r < t; ++r) {
      const o = n[r];
      if (!("style" in o))
        throw new Error("Expected a list of rules with a style property");
      s[r] = o;
    }
    return td(s);
  }
  return Ko(
    /** @type {Array<import("../style/flat.js").FlatStyle>} */
    n
  );
}
class yl extends se {
  /**
   * @param {import("./EventType.js").default} type Type.
   * @param {import("../transform.js").Transform} [inversePixelTransform] Transform for
   *     CSS pixels to rendered pixels.
   * @param {import("../Map.js").FrameState} [frameState] Frame state.
   * @param {?(CanvasRenderingContext2D|WebGLRenderingContext)} [context] Context.
   */
  constructor(t, e, i, s) {
    super(t), this.inversePixelTransform = e, this.frameState = i, this.context = s;
  }
}
class gd extends ts {
  /**
   * @param {import("../Map.js").default} map Map.
   */
  constructor(t) {
    super(), this.map_ = t;
  }
  /**
   * @abstract
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  dispatchRenderEvent(t, e) {
    j();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @protected
   */
  calculateMatrices2D(t) {
    const e = t.viewState, i = t.coordinateToPixelTransform, s = t.pixelToCoordinateTransform;
    pe(
      i,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / e.resolution,
      -1 / e.resolution,
      -e.rotation,
      -e.center[0],
      -e.center[1]
    ), Ga(s, i);
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {boolean} checkWrapped Check for wrapped geometries.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg2 Value to use as `this` when executing `layerFilter`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  forEachFeatureAtCoordinate(t, e, i, s, r, o, a, l) {
    let c;
    const h = e.viewState;
    function u(y, x, R, T) {
      return r.call(o, x, y ? R : null, T);
    }
    const d = h.projection, f = va(t.slice(), d), g = [[0, 0]];
    if (d.canWrapX() && s) {
      const y = d.getExtent(), x = J(y);
      g.push([-x, 0], [x, 0]);
    }
    const m = e.layerStatesArray, _ = m.length, p = (
      /** @type {Array<HitMatch<T>>} */
      []
    ), E = [];
    for (let y = 0; y < g.length; y++)
      for (let x = _ - 1; x >= 0; --x) {
        const R = m[x], T = R.layer;
        if (T.hasRenderer() && zr(R, h) && a.call(l, T)) {
          const S = T.getRenderer(), v = T.getSource();
          if (S && v) {
            const L = v.getWrapX() ? f : t, k = u.bind(
              null,
              R.managed
            );
            E[0] = L[0] + g[y][0], E[1] = L[1] + g[y][1], c = S.forEachFeatureAtCoordinate(
              E,
              e,
              i,
              k,
              p
            );
          }
          if (c)
            return c;
        }
      }
    if (p.length === 0)
      return;
    const w = 1 / p.length;
    return p.forEach((y, x) => y.distanceSq += x * w), p.sort((y, x) => y.distanceSq - x.distanceSq), p.some((y) => c = y.callback(y.feature, y.layer, y.geometry)), c;
  }
  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {boolean} checkWrapped Check for wrapped geometries.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg Value to use as `this` when executing `layerFilter`.
   * @return {boolean} Is there a feature at the given coordinate?
   * @template U
   */
  hasFeatureAtCoordinate(t, e, i, s, r, o) {
    return this.forEachFeatureAtCoordinate(
      t,
      e,
      i,
      s,
      Ze,
      this,
      r,
      o
    ) !== void 0;
  }
  /**
   * @return {import("../Map.js").default} Map.
   */
  getMap() {
    return this.map_;
  }
  /**
   * Render.
   * @abstract
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   */
  renderFrame(t) {
    j();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  scheduleExpireIconCache(t) {
    zt.canExpireCache() && t.postRenderFunctions.push(_d);
  }
}
function _d(n, t) {
  zt.expire();
}
class md extends gd {
  /**
   * @param {import("../Map.js").default} map Map.
   */
  constructor(t) {
    super(t), this.fontChangeListenerKey_ = U(
      ue,
      wi.PROPERTYCHANGE,
      t.redrawText,
      t
    ), this.element_ = document.createElement("div");
    const e = this.element_.style;
    e.position = "absolute", e.width = "100%", e.height = "100%", e.zIndex = "0", this.element_.className = ds + " ol-layers";
    const i = t.getViewport();
    i.insertBefore(this.element_, i.firstChild || null), this.children_ = [], this.renderedVisible_ = !0;
  }
  /**
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @override
   */
  dispatchRenderEvent(t, e) {
    const i = this.getMap();
    if (i.hasListener(t)) {
      const s = new yl(t, void 0, e);
      i.dispatchEvent(s);
    }
  }
  /**
   * @override
   */
  disposeInternal() {
    tt(this.fontChangeListenerKey_), this.element_.remove(), super.disposeInternal();
  }
  /**
   * Render.
   * @param {?import("../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderFrame(t) {
    if (!t) {
      this.renderedVisible_ && (this.element_.style.display = "none", this.renderedVisible_ = !1);
      return;
    }
    this.calculateMatrices2D(t), this.dispatchRenderEvent(Gt.PRECOMPOSE, t);
    const e = t.layerStatesArray.sort(
      (a, l) => a.zIndex - l.zIndex
    );
    e.some(
      (a) => a.layer instanceof pl && a.layer.getDeclutter()
    ) && (t.declutter = {});
    const s = t.viewState;
    this.children_.length = 0;
    const r = [];
    let o = null;
    for (let a = 0, l = e.length; a < l; ++a) {
      const c = e[a];
      t.layerIndex = a;
      const h = c.layer, u = h.getSourceState();
      if (!zr(c, s) || u != "ready" && u != "undefined") {
        h.unrender();
        continue;
      }
      const d = h.render(t, o);
      d && (d !== o && (this.children_.push(d), o = d), r.push(c));
    }
    this.declutter(t, r), Ac(this.element_, this.children_), this.dispatchRenderEvent(Gt.POSTCOMPOSE, t), this.renderedVisible_ || (this.element_.style.display = "", this.renderedVisible_ = !0), this.scheduleExpireIconCache(t);
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {Array<import('../layer/Layer.js').State>} layerStates Layers.
   */
  declutter(t, e) {
    if (t.declutter) {
      for (let i = e.length - 1; i >= 0; --i) {
        const s = e[i], r = s.layer;
        r.getDeclutter() && r.renderDeclutter(t, s);
      }
      e.forEach(
        (i) => i.layer.renderDeferred(t)
      );
    }
  }
}
function El(n) {
  if (n instanceof gs) {
    n.setMapInternal(null);
    return;
  }
  n instanceof bi && n.getLayers().forEach(El);
}
function xl(n, t) {
  if (n instanceof gs) {
    n.setMapInternal(t);
    return;
  }
  if (n instanceof bi) {
    const e = n.getLayers().getArray();
    for (let i = 0, s = e.length; i < s; ++i)
      xl(e[i], t);
  }
}
class pd extends $t {
  /**
   * @param {MapOptions} [options] Map options.
   */
  constructor(t) {
    super(), t = t || {}, this.on, this.once, this.un;
    const e = yd(t);
    this.renderComplete_ = !1, this.loaded_ = !0, this.boundHandleBrowserEvent_ = this.handleBrowserEvent.bind(this), this.maxTilesLoading_ = t.maxTilesLoading !== void 0 ? t.maxTilesLoading : 16, this.pixelRatio_ = t.pixelRatio !== void 0 ? t.pixelRatio : Jl, this.postRenderTimeoutHandle_, this.animationDelayKey_, this.animationDelay_ = this.animationDelay_.bind(this), this.coordinateToPixelTransform_ = jt(), this.pixelToCoordinateTransform_ = jt(), this.frameIndex_ = 0, this.frameState_ = null, this.previousExtent_ = null, this.viewPropertyListenerKey_ = null, this.viewChangeListenerKey_ = null, this.layerGroupPropertyListenerKeys_ = null, this.viewport_ = document.createElement("div"), this.viewport_.className = "ol-viewport" + ("ontouchstart" in window ? " ol-touch" : ""), this.viewport_.style.position = "relative", this.viewport_.style.overflow = "hidden", this.viewport_.style.width = "100%", this.viewport_.style.height = "100%", this.overlayContainer_ = document.createElement("div"), this.overlayContainer_.style.position = "absolute", this.overlayContainer_.style.zIndex = "0", this.overlayContainer_.style.width = "100%", this.overlayContainer_.style.height = "100%", this.overlayContainer_.style.pointerEvents = "none", this.overlayContainer_.className = "ol-overlaycontainer", this.viewport_.appendChild(this.overlayContainer_), this.overlayContainerStopEvent_ = document.createElement("div"), this.overlayContainerStopEvent_.style.position = "absolute", this.overlayContainerStopEvent_.style.zIndex = "0", this.overlayContainerStopEvent_.style.width = "100%", this.overlayContainerStopEvent_.style.height = "100%", this.overlayContainerStopEvent_.style.pointerEvents = "none", this.overlayContainerStopEvent_.className = "ol-overlaycontainer-stopevent", this.viewport_.appendChild(this.overlayContainerStopEvent_), this.mapBrowserEventHandler_ = null, this.moveTolerance_ = t.moveTolerance, this.keyboardEventTarget_ = e.keyboardEventTarget, this.targetChangeHandlerKeys_ = null, this.targetElement_ = null, this.resizeObserver_ = new ResizeObserver(() => this.updateSize()), this.controls = e.controls || Oc(), this.interactions = e.interactions || Jc({
      onFocusOnly: !0
    }), this.overlays_ = e.overlays, this.overlayIdIndex_ = {}, this.renderer_ = null, this.postRenderFunctions_ = [], this.tileQueue_ = new eh(
      this.getTilePriority.bind(this),
      this.handleTileChange_.bind(this)
    ), this.addChangeListener(
      yt.LAYERGROUP,
      this.handleLayerGroupChanged_
    ), this.addChangeListener(yt.VIEW, this.handleViewChanged_), this.addChangeListener(yt.SIZE, this.handleSizeChanged_), this.addChangeListener(yt.TARGET, this.handleTargetChanged_), this.setProperties(e.values);
    const i = this;
    t.view && !(t.view instanceof ee) && t.view.then(function(s) {
      i.setView(new ee(s));
    }), this.controls.addEventListener(
      ft.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./control/Control.js").default>} event CollectionEvent
       */
      (s) => {
        s.element.setMap(this);
      }
    ), this.controls.addEventListener(
      ft.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./control/Control.js").default>} event CollectionEvent.
       */
      (s) => {
        s.element.setMap(null);
      }
    ), this.interactions.addEventListener(
      ft.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./interaction/Interaction.js").default>} event CollectionEvent.
       */
      (s) => {
        s.element.setMap(this);
      }
    ), this.interactions.addEventListener(
      ft.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./interaction/Interaction.js").default>} event CollectionEvent.
       */
      (s) => {
        s.element.setMap(null);
      }
    ), this.overlays_.addEventListener(
      ft.ADD,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./Overlay.js").default>} event CollectionEvent.
       */
      (s) => {
        this.addOverlayInternal_(s.element);
      }
    ), this.overlays_.addEventListener(
      ft.REMOVE,
      /**
       * @param {import("./Collection.js").CollectionEvent<import("./Overlay.js").default>} event CollectionEvent.
       */
      (s) => {
        const r = s.element.getId();
        r !== void 0 && delete this.overlayIdIndex_[r.toString()], s.element.setMap(null);
      }
    ), this.controls.forEach(
      /**
       * @param {import("./control/Control.js").default} control Control.
       */
      (s) => {
        s.setMap(this);
      }
    ), this.interactions.forEach(
      /**
       * @param {import("./interaction/Interaction.js").default} interaction Interaction.
       */
      (s) => {
        s.setMap(this);
      }
    ), this.overlays_.forEach(this.addOverlayInternal_.bind(this));
  }
  /**
   * Add the given control to the map.
   * @param {import("./control/Control.js").default} control Control.
   * @api
   */
  addControl(t) {
    this.getControls().push(t);
  }
  /**
   * Add the given interaction to the map. If you want to add an interaction
   * at another point of the collection use `getInteractions()` and the methods
   * available on {@link module:ol/Collection~Collection}. This can be used to
   * stop the event propagation from the handleEvent function. The interactions
   * get to handle the events in the reverse order of this collection.
   * @param {import("./interaction/Interaction.js").default} interaction Interaction to add.
   * @api
   */
  addInteraction(t) {
    this.getInteractions().push(t);
  }
  /**
   * Adds the given layer to the top of this map. If you want to add a layer
   * elsewhere in the stack, use `getLayers()` and the methods available on
   * {@link module:ol/Collection~Collection}.
   * @param {import("./layer/Base.js").default} layer Layer.
   * @api
   */
  addLayer(t) {
    this.getLayerGroup().getLayers().push(t);
  }
  /**
   * @param {import("./layer/Group.js").GroupEvent} event The layer add event.
   * @private
   */
  handleLayerAdd_(t) {
    xl(t.layer, this);
  }
  /**
   * Add the given overlay to the map.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @api
   */
  addOverlay(t) {
    this.getOverlays().push(t);
  }
  /**
   * This deals with map's overlay collection changes.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @private
   */
  addOverlayInternal_(t) {
    const e = t.getId();
    e !== void 0 && (this.overlayIdIndex_[e.toString()] = t), t.setMap(this);
  }
  /**
   *
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.controls.clear(), this.interactions.clear(), this.overlays_.clear(), this.resizeObserver_.disconnect(), this.setTarget(null), super.disposeInternal();
  }
  /**
   * Detect features that intersect a pixel on the viewport, and execute a
   * callback with each intersecting feature. Layers included in the detection can
   * be configured through the `layerFilter` option in `options`.
   * For polygons without a fill, only the stroke will be used for hit detection.
   * Polygons must have a fill style applied to ensure that pixels inside a polygon are detected.
   * The fill can be transparent.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {function(import("./Feature.js").FeatureLike, import("./layer/Layer.js").default<import("./source/Source").default>, import("./geom/SimpleGeometry.js").default): T} callback Feature callback. The callback will be
   *     called with two arguments. The first argument is one
   *     {@link module:ol/Feature~Feature feature} or
   *     {@link module:ol/render/Feature~RenderFeature render feature} at the pixel, the second is
   *     the {@link module:ol/layer/Layer~Layer layer} of the feature and will be null for
   *     unmanaged layers. To stop detection, callback functions can return a
   *     truthy value.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {T|undefined} Callback result, i.e. the return value of last
   * callback execution, or the first truthy callback return value.
   * @template T
   * @api
   */
  forEachFeatureAtPixel(t, e, i) {
    if (!this.frameState_ || !this.renderer_)
      return;
    const s = this.getCoordinateFromPixelInternal(t);
    i = i !== void 0 ? i : {};
    const r = i.hitTolerance !== void 0 ? i.hitTolerance : 0, o = i.layerFilter !== void 0 ? i.layerFilter : Ze, a = i.checkWrapped !== !1;
    return this.renderer_.forEachFeatureAtCoordinate(
      s,
      this.frameState_,
      r,
      a,
      e,
      null,
      o,
      null
    );
  }
  /**
   * Get all features that intersect a pixel on the viewport.
   * For polygons without a fill, only the stroke will be used for hit detection.
   * Polygons must have a fill style applied to ensure that pixels inside a polygon are detected.
   * The fill can be transparent.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {Array<import("./Feature.js").FeatureLike>} The detected features or
   * an empty array if none were found.
   * @api
   */
  getFeaturesAtPixel(t, e) {
    const i = [];
    return this.forEachFeatureAtPixel(
      t,
      function(s) {
        i.push(s);
      },
      e
    ), i;
  }
  /**
   * Get all layers from all layer groups.
   * @return {Array<import("./layer/Layer.js").default>} Layers.
   * @api
   */
  getAllLayers() {
    const t = [];
    function e(i) {
      i.forEach(function(s) {
        s instanceof bi ? e(s.getLayers()) : t.push(s);
      });
    }
    return e(this.getLayers()), t;
  }
  /**
   * Detect if features intersect a pixel on the viewport. Layers included in the
   * detection can be configured through the `layerFilter` option.
   * For polygons without a fill, only the stroke will be used for hit detection.
   * Polygons must have a fill style applied to ensure that pixels inside a polygon are detected.
   * The fill can be transparent.
   * @param {import("./pixel.js").Pixel} pixel Pixel.
   * @param {AtPixelOptions} [options] Optional options.
   * @return {boolean} Is there a feature at the given pixel?
   * @api
   */
  hasFeatureAtPixel(t, e) {
    if (!this.frameState_ || !this.renderer_)
      return !1;
    const i = this.getCoordinateFromPixelInternal(t);
    e = e !== void 0 ? e : {};
    const s = e.layerFilter !== void 0 ? e.layerFilter : Ze, r = e.hitTolerance !== void 0 ? e.hitTolerance : 0, o = e.checkWrapped !== !1;
    return this.renderer_.hasFeatureAtCoordinate(
      i,
      this.frameState_,
      r,
      o,
      s,
      null
    );
  }
  /**
   * Returns the coordinate in user projection for a browser event.
   * @param {MouseEvent} event Event.
   * @return {import("./coordinate.js").Coordinate} Coordinate.
   * @api
   */
  getEventCoordinate(t) {
    return this.getCoordinateFromPixel(this.getEventPixel(t));
  }
  /**
   * Returns the coordinate in view projection for a browser event.
   * @param {MouseEvent} event Event.
   * @return {import("./coordinate.js").Coordinate} Coordinate.
   */
  getEventCoordinateInternal(t) {
    return this.getCoordinateFromPixelInternal(this.getEventPixel(t));
  }
  /**
   * Returns the map pixel position for a browser event relative to the viewport.
   * @param {UIEvent|{clientX: number, clientY: number}} event Event.
   * @return {import("./pixel.js").Pixel} Pixel.
   * @api
   */
  getEventPixel(t) {
    const i = this.viewport_.getBoundingClientRect(), s = this.getSize(), r = i.width / s[0], o = i.height / s[1], a = (
      //FIXME Are we really calling this with a TouchEvent anywhere?
      "changedTouches" in t ? (
        /** @type {TouchEvent} */
        t.changedTouches[0]
      ) : (
        /** @type {MouseEvent} */
        t
      )
    );
    return [
      (a.clientX - i.left) / r,
      (a.clientY - i.top) / o
    ];
  }
  /**
   * Get the target in which this map is rendered.
   * Note that this returns what is entered as an option or in setTarget:
   * if that was an element, it returns an element; if a string, it returns that.
   * @return {HTMLElement|string|undefined} The Element or id of the Element that the
   *     map is rendered in.
   * @observable
   * @api
   */
  getTarget() {
    return (
      /** @type {HTMLElement|string|undefined} */
      this.get(yt.TARGET)
    );
  }
  /**
   * Get the DOM element into which this map is rendered. In contrast to
   * `getTarget` this method always return an `Element`, or `null` if the
   * map has no target.
   * @return {HTMLElement} The element that the map is rendered in.
   * @api
   */
  getTargetElement() {
    return this.targetElement_;
  }
  /**
   * Get the coordinate for a given pixel.  This returns a coordinate in the
   * user projection.
   * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
   * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
   * @api
   */
  getCoordinateFromPixel(t) {
    return ar(
      this.getCoordinateFromPixelInternal(t),
      this.getView().getProjection()
    );
  }
  /**
   * Get the coordinate for a given pixel.  This returns a coordinate in the
   * map view projection.
   * @param {import("./pixel.js").Pixel} pixel Pixel position in the map viewport.
   * @return {import("./coordinate.js").Coordinate} The coordinate for the pixel position.
   */
  getCoordinateFromPixelInternal(t) {
    const e = this.frameState_;
    return e ? dt(e.pixelToCoordinateTransform, t.slice()) : null;
  }
  /**
   * Get the map controls. Modifying this collection changes the controls
   * associated with the map.
   * @return {Collection<import("./control/Control.js").default>} Controls.
   * @api
   */
  getControls() {
    return this.controls;
  }
  /**
   * Get the map overlays. Modifying this collection changes the overlays
   * associated with the map.
   * @return {Collection<import("./Overlay.js").default>} Overlays.
   * @api
   */
  getOverlays() {
    return this.overlays_;
  }
  /**
   * Get an overlay by its identifier (the value returned by overlay.getId()).
   * Note that the index treats string and numeric identifiers as the same. So
   * `map.getOverlayById(2)` will return an overlay with id `'2'` or `2`.
   * @param {string|number} id Overlay identifier.
   * @return {import("./Overlay.js").default|null} Overlay.
   * @api
   */
  getOverlayById(t) {
    const e = this.overlayIdIndex_[t.toString()];
    return e !== void 0 ? e : null;
  }
  /**
   * Get the map interactions. Modifying this collection changes the interactions
   * associated with the map.
   *
   * Interactions are used for e.g. pan, zoom and rotate.
   * @return {Collection<import("./interaction/Interaction.js").default>} Interactions.
   * @api
   */
  getInteractions() {
    return this.interactions;
  }
  /**
   * Get the layergroup associated with this map.
   * @return {LayerGroup} A layer group containing the layers in this map.
   * @observable
   * @api
   */
  getLayerGroup() {
    return (
      /** @type {LayerGroup} */
      this.get(yt.LAYERGROUP)
    );
  }
  /**
   * Clear any existing layers and add layers to the map.
   * @param {Array<import("./layer/Base.js").default>|Collection<import("./layer/Base.js").default>} layers The layers to be added to the map.
   * @api
   */
  setLayers(t) {
    const e = this.getLayerGroup();
    if (t instanceof Ut) {
      e.setLayers(t);
      return;
    }
    const i = e.getLayers();
    i.clear(), i.extend(t);
  }
  /**
   * Get the collection of layers associated with this map.
   * @return {!Collection<import("./layer/Base.js").default>} Layers.
   * @api
   */
  getLayers() {
    return this.getLayerGroup().getLayers();
  }
  /**
   * @return {boolean} Layers have sources that are still loading.
   */
  getLoadingOrNotReady() {
    const t = this.getLayerGroup().getLayerStatesArray();
    for (let e = 0, i = t.length; e < i; ++e) {
      const s = t[e];
      if (!s.visible)
        continue;
      const r = s.layer.getRenderer();
      if (r && !r.ready)
        return !0;
      const o = s.layer.getSource();
      if (o && o.loading)
        return !0;
    }
    return !1;
  }
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the user
   * projection and returns the corresponding pixel.
   * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
   * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
   * @api
   */
  getPixelFromCoordinate(t) {
    const e = ce(
      t,
      this.getView().getProjection()
    );
    return this.getPixelFromCoordinateInternal(e);
  }
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the map view
   * projection and returns the corresponding pixel.
   * @param {import("./coordinate.js").Coordinate} coordinate A map coordinate.
   * @return {import("./pixel.js").Pixel} A pixel position in the map viewport.
   */
  getPixelFromCoordinateInternal(t) {
    const e = this.frameState_;
    return e ? dt(
      e.coordinateToPixelTransform,
      t.slice(0, 2)
    ) : null;
  }
  /**
   * Get the map renderer.
   * @return {import("./renderer/Map.js").default|null} Renderer
   */
  getRenderer() {
    return this.renderer_;
  }
  /**
   * Get the size of this map.
   * @return {import("./size.js").Size|undefined} The size in pixels of the map in the DOM.
   * @observable
   * @api
   */
  getSize() {
    return (
      /** @type {import("./size.js").Size|undefined} */
      this.get(yt.SIZE)
    );
  }
  /**
   * Get the view associated with this map. A view manages properties such as
   * center and resolution.
   * @return {View} The view that controls this map.
   * @observable
   * @api
   */
  getView() {
    return (
      /** @type {View} */
      this.get(yt.VIEW)
    );
  }
  /**
   * Get the element that serves as the map viewport.
   * @return {HTMLElement} Viewport.
   * @api
   */
  getViewport() {
    return this.viewport_;
  }
  /**
   * Get the element that serves as the container for overlays.  Elements added to
   * this container will let mousedown and touchstart events through to the map,
   * so clicks and gestures on an overlay will trigger {@link module:ol/MapBrowserEvent~MapBrowserEvent}
   * events.
   * @return {!HTMLElement} The map's overlay container.
   */
  getOverlayContainer() {
    return this.overlayContainer_;
  }
  /**
   * Get the element that serves as a container for overlays that don't allow
   * event propagation. Elements added to this container won't let mousedown and
   * touchstart events through to the map, so clicks and gestures on an overlay
   * don't trigger any {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   * @return {!HTMLElement} The map's overlay container that stops events.
   */
  getOverlayContainerStopEvent() {
    return this.overlayContainerStopEvent_;
  }
  /**
   * @return {!Document} The document where the map is displayed.
   */
  getOwnerDocument() {
    const t = this.getTargetElement();
    return t ? t.ownerDocument : document;
  }
  /**
   * @param {import("./Tile.js").default} tile Tile.
   * @param {string} tileSourceKey Tile source key.
   * @param {import("./coordinate.js").Coordinate} tileCenter Tile center.
   * @param {number} tileResolution Tile resolution.
   * @return {number} Tile priority.
   */
  getTilePriority(t, e, i, s) {
    return ih(
      this.frameState_,
      t,
      e,
      i,
      s
    );
  }
  /**
   * @param {PointerEvent|KeyboardEvent|WheelEvent} browserEvent Browser event.
   * @param {string} [type] Type.
   */
  handleBrowserEvent(t, e) {
    e = e || t.type;
    const i = new Te(e, this, t);
    this.handleMapBrowserEvent(i);
  }
  /**
   * @param {MapBrowserEvent} mapBrowserEvent The event to handle.
   */
  handleMapBrowserEvent(t) {
    if (!this.frameState_)
      return;
    const e = t.originalEvent, i = e.type;
    if (i === Qs.POINTERDOWN || i === z.WHEEL || i === z.KEYDOWN) {
      const s = this.getOwnerDocument(), r = this.viewport_.getRootNode ? this.viewport_.getRootNode() : s, o = (
        /** @type {Node} */
        e.target
      ), a = r instanceof ShadowRoot ? r.host === o ? r.host.ownerDocument : r : r === s ? s.documentElement : r;
      if (
        // Abort if the target is a child of the container for elements whose events are not meant
        // to be handled by map interactions.
        this.overlayContainerStopEvent_.contains(o) || // Abort if the event target is a child of the container that is no longer in the page.
        // It's possible for the target to no longer be in the page if it has been removed in an
        // event listener, this might happen in a Control that recreates it's content based on
        // user interaction either manually or via a render in something like https://reactjs.org/
        !a.contains(o)
      )
        return;
    }
    if (t.frameState = this.frameState_, this.dispatchEvent(t) !== !1) {
      const s = this.getInteractions().getArray().slice();
      for (let r = s.length - 1; r >= 0; r--) {
        const o = s[r];
        if (o.getMap() !== this || !o.getActive() || !this.getTargetElement())
          continue;
        if (!o.handleEvent(t) || t.propagationStopped)
          break;
      }
    }
  }
  /**
   * @protected
   */
  handlePostRender() {
    const t = this.frameState_, e = this.tileQueue_;
    if (!e.isEmpty()) {
      let s = this.maxTilesLoading_, r = s;
      if (t) {
        const o = t.viewHints;
        if (o[Et.ANIMATING] || o[Et.INTERACTING]) {
          const a = Date.now() - t.time > 8;
          s = a ? 0 : 8, r = a ? 0 : 2;
        }
      }
      e.getTilesLoading() < s && (e.reprioritize(), e.loadMoreTiles(s, r));
    }
    t && this.renderer_ && !t.animate && (this.renderComplete_ ? (this.hasListener(Gt.RENDERCOMPLETE) && this.renderer_.dispatchRenderEvent(
      Gt.RENDERCOMPLETE,
      t
    ), this.loaded_ === !1 && (this.loaded_ = !0, this.dispatchEvent(
      new hi(de.LOADEND, this, t)
    ))) : this.loaded_ === !0 && (this.loaded_ = !1, this.dispatchEvent(
      new hi(de.LOADSTART, this, t)
    )));
    const i = this.postRenderFunctions_;
    if (t)
      for (let s = 0, r = i.length; s < r; ++s)
        i[s](this, t);
    i.length = 0;
  }
  /**
   * @private
   */
  handleSizeChanged_() {
    this.getView() && !this.getView().getAnimating() && this.getView().resolveConstraints(0), this.render();
  }
  /**
   * @private
   */
  handleTargetChanged_() {
    if (this.mapBrowserEventHandler_) {
      for (let i = 0, s = this.targetChangeHandlerKeys_.length; i < s; ++i)
        tt(this.targetChangeHandlerKeys_[i]);
      this.targetChangeHandlerKeys_ = null, this.viewport_.removeEventListener(
        z.CONTEXTMENU,
        this.boundHandleBrowserEvent_
      ), this.viewport_.removeEventListener(
        z.WHEEL,
        this.boundHandleBrowserEvent_
      ), this.mapBrowserEventHandler_.dispose(), this.mapBrowserEventHandler_ = null, this.viewport_.remove();
    }
    if (this.targetElement_) {
      this.resizeObserver_.unobserve(this.targetElement_);
      const i = this.targetElement_.getRootNode();
      i instanceof ShadowRoot && this.resizeObserver_.unobserve(i.host), this.setSize(void 0);
    }
    const t = this.getTarget(), e = typeof t == "string" ? document.getElementById(t) : t;
    if (this.targetElement_ = e, !e)
      this.renderer_ && (clearTimeout(this.postRenderTimeoutHandle_), this.postRenderTimeoutHandle_ = void 0, this.postRenderFunctions_.length = 0, this.renderer_.dispose(), this.renderer_ = null), this.animationDelayKey_ && (cancelAnimationFrame(this.animationDelayKey_), this.animationDelayKey_ = void 0);
    else {
      e.appendChild(this.viewport_), this.renderer_ || (this.renderer_ = new md(this)), this.mapBrowserEventHandler_ = new Ql(
        this,
        this.moveTolerance_
      );
      for (const r in et)
        this.mapBrowserEventHandler_.addEventListener(
          et[r],
          this.handleMapBrowserEvent.bind(this)
        );
      this.viewport_.addEventListener(
        z.CONTEXTMENU,
        this.boundHandleBrowserEvent_,
        !1
      ), this.viewport_.addEventListener(
        z.WHEEL,
        this.boundHandleBrowserEvent_,
        pa ? { passive: !1 } : !1
      );
      let i;
      if (this.keyboardEventTarget_)
        i = this.keyboardEventTarget_;
      else {
        const r = e.getRootNode();
        i = r instanceof ShadowRoot ? r.host : e;
      }
      this.targetChangeHandlerKeys_ = [
        U(
          i,
          z.KEYDOWN,
          this.handleBrowserEvent,
          this
        ),
        U(
          i,
          z.KEYPRESS,
          this.handleBrowserEvent,
          this
        )
      ];
      const s = e.getRootNode();
      s instanceof ShadowRoot && this.resizeObserver_.observe(s.host), this.resizeObserver_.observe(e);
    }
    this.updateSize();
  }
  /**
   * @private
   */
  handleTileChange_() {
    this.render();
  }
  /**
   * @private
   */
  handleViewPropertyChanged_() {
    this.render();
  }
  /**
   * @private
   */
  handleViewChanged_() {
    this.viewPropertyListenerKey_ && (tt(this.viewPropertyListenerKey_), this.viewPropertyListenerKey_ = null), this.viewChangeListenerKey_ && (tt(this.viewChangeListenerKey_), this.viewChangeListenerKey_ = null);
    const t = this.getView();
    t && (this.updateViewportSize_(this.getSize()), this.viewPropertyListenerKey_ = U(
      t,
      wi.PROPERTYCHANGE,
      this.handleViewPropertyChanged_,
      this
    ), this.viewChangeListenerKey_ = U(
      t,
      z.CHANGE,
      this.handleViewPropertyChanged_,
      this
    ), t.resolveConstraints(0)), this.render();
  }
  /**
   * @private
   */
  handleLayerGroupChanged_() {
    this.layerGroupPropertyListenerKeys_ && (this.layerGroupPropertyListenerKeys_.forEach(tt), this.layerGroupPropertyListenerKeys_ = null);
    const t = this.getLayerGroup();
    t && (this.handleLayerAdd_(new Ie("addlayer", t)), this.layerGroupPropertyListenerKeys_ = [
      U(t, wi.PROPERTYCHANGE, this.render, this),
      U(t, z.CHANGE, this.render, this),
      U(t, "addlayer", this.handleLayerAdd_, this),
      U(t, "removelayer", this.handleLayerRemove_, this)
    ]), this.render();
  }
  /**
   * @return {boolean} Is rendered.
   */
  isRendered() {
    return !!this.frameState_;
  }
  /**
   * @private
   */
  animationDelay_() {
    this.animationDelayKey_ = void 0, this.renderFrame_(Date.now());
  }
  /**
   * Requests an immediate render in a synchronous manner.
   * @api
   */
  renderSync() {
    this.animationDelayKey_ && cancelAnimationFrame(this.animationDelayKey_), this.animationDelay_();
  }
  /**
   * Redraws all text after new fonts have loaded
   */
  redrawText() {
    const t = this.getLayerGroup().getLayerStatesArray();
    for (let e = 0, i = t.length; e < i; ++e) {
      const s = t[e].layer;
      s.hasRenderer() && s.getRenderer().handleFontsChanged();
    }
  }
  /**
   * Request a map rendering (at the next animation frame).
   * @api
   */
  render() {
    this.renderer_ && this.animationDelayKey_ === void 0 && (this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_));
  }
  /**
   * Remove the given control from the map.
   * @param {import("./control/Control.js").default} control Control.
   * @return {import("./control/Control.js").default|undefined} The removed control (or undefined
   *     if the control was not found).
   * @api
   */
  removeControl(t) {
    return this.getControls().remove(t);
  }
  /**
   * Remove the given interaction from the map.
   * @param {import("./interaction/Interaction.js").default} interaction Interaction to remove.
   * @return {import("./interaction/Interaction.js").default|undefined} The removed interaction (or
   *     undefined if the interaction was not found).
   * @api
   */
  removeInteraction(t) {
    return this.getInteractions().remove(t);
  }
  /**
   * Removes the given layer from the map.
   * @param {import("./layer/Base.js").default} layer Layer.
   * @return {import("./layer/Base.js").default|undefined} The removed layer (or undefined if the
   *     layer was not found).
   * @api
   */
  removeLayer(t) {
    return this.getLayerGroup().getLayers().remove(t);
  }
  /**
   * @param {import("./layer/Group.js").GroupEvent} event The layer remove event.
   * @private
   */
  handleLayerRemove_(t) {
    El(t.layer);
  }
  /**
   * Remove the given overlay from the map.
   * @param {import("./Overlay.js").default} overlay Overlay.
   * @return {import("./Overlay.js").default|undefined} The removed overlay (or undefined
   *     if the overlay was not found).
   * @api
   */
  removeOverlay(t) {
    return this.getOverlays().remove(t);
  }
  /**
   * @param {number} time Time.
   * @private
   */
  renderFrame_(t) {
    const e = this.getSize(), i = this.getView(), s = this.frameState_;
    let r = null;
    if (e !== void 0 && ko(e) && i && i.isDef()) {
      const o = i.getHints(
        this.frameState_ ? this.frameState_.viewHints : void 0
      ), a = i.getState();
      if (r = {
        animate: !1,
        coordinateToPixelTransform: this.coordinateToPixelTransform_,
        declutter: null,
        extent: nr(
          a.center,
          a.resolution,
          a.rotation,
          e
        ),
        index: this.frameIndex_++,
        layerIndex: 0,
        layerStatesArray: this.getLayerGroup().getLayerStatesArray(),
        pixelRatio: this.pixelRatio_,
        pixelToCoordinateTransform: this.pixelToCoordinateTransform_,
        postRenderFunctions: [],
        size: e,
        tileQueue: this.tileQueue_,
        time: t,
        usedTiles: {},
        viewState: a,
        viewHints: o,
        wantedTiles: {},
        mapId: B(this),
        renderTargets: {}
      }, a.nextCenter && a.nextResolution) {
        const l = isNaN(a.nextRotation) ? a.rotation : a.nextRotation;
        r.nextExtent = nr(
          a.nextCenter,
          a.nextResolution,
          l,
          e
        );
      }
    }
    this.frameState_ = r, this.renderer_.renderFrame(r), r && (r.animate && this.render(), Array.prototype.push.apply(
      this.postRenderFunctions_,
      r.postRenderFunctions
    ), s && (!this.previousExtent_ || !as(this.previousExtent_) && !tn(r.extent, this.previousExtent_)) && (this.dispatchEvent(
      new hi(de.MOVESTART, this, s)
    ), this.previousExtent_ = ns(this.previousExtent_)), this.previousExtent_ && !r.viewHints[Et.ANIMATING] && !r.viewHints[Et.INTERACTING] && !tn(r.extent, this.previousExtent_) && (this.dispatchEvent(
      new hi(de.MOVEEND, this, r)
    ), ya(r.extent, this.previousExtent_))), this.dispatchEvent(new hi(de.POSTRENDER, this, r)), this.renderComplete_ = (this.hasListener(de.LOADSTART) || this.hasListener(de.LOADEND) || this.hasListener(Gt.RENDERCOMPLETE)) && !this.tileQueue_.getTilesLoading() && !this.tileQueue_.getCount() && !this.getLoadingOrNotReady(), this.postRenderTimeoutHandle_ || (this.postRenderTimeoutHandle_ = setTimeout(() => {
      this.postRenderTimeoutHandle_ = void 0, this.handlePostRender();
    }, 0));
  }
  /**
   * Sets the layergroup of this map.
   * @param {LayerGroup} layerGroup A layer group containing the layers in this map.
   * @observable
   * @api
   */
  setLayerGroup(t) {
    const e = this.getLayerGroup();
    e && this.handleLayerRemove_(new Ie("removelayer", e)), this.set(yt.LAYERGROUP, t);
  }
  /**
   * Set the size of this map.
   * @param {import("./size.js").Size|undefined} size The size in pixels of the map in the DOM.
   * @observable
   * @api
   */
  setSize(t) {
    this.set(yt.SIZE, t);
  }
  /**
   * Set the target element to render this map into.
   * For accessibility (focus and keyboard events for map navigation), the `target` element must have a
   *  properly configured `tabindex` attribute. If the `target` element is inside a Shadow DOM, the
   *  `tabindex` atribute must be set on the custom element's host element.
   * @param {HTMLElement|string} [target] The Element or id of the Element
   *     that the map is rendered in.
   * @observable
   * @api
   */
  setTarget(t) {
    this.set(yt.TARGET, t);
  }
  /**
   * Set the view for this map.
   * @param {View|Promise<import("./View.js").ViewOptions>|null} view The view that controls this map.
   * It is also possible to pass a promise that resolves to options for constructing a view.  This
   * alternative allows view properties to be resolved by sources or other components that load
   * view-related metadata.
   * @observable
   * @api
   */
  setView(t) {
    if (!t || t instanceof ee) {
      this.set(yt.VIEW, t);
      return;
    }
    this.set(yt.VIEW, new ee());
    const e = this;
    t.then(function(i) {
      e.setView(new ee(i));
    });
  }
  /**
   * Force a recalculation of the map viewport size.  This should be called when
   * third-party code changes the size of the map viewport.
   * @api
   */
  updateSize() {
    const t = this.getTargetElement();
    let e;
    if (t) {
      const s = getComputedStyle(t), r = t.offsetWidth - parseFloat(s.borderLeftWidth) - parseFloat(s.paddingLeft) - parseFloat(s.paddingRight) - parseFloat(s.borderRightWidth), o = t.offsetHeight - parseFloat(s.borderTopWidth) - parseFloat(s.paddingTop) - parseFloat(s.paddingBottom) - parseFloat(s.borderBottomWidth);
      !isNaN(r) && !isNaN(o) && (e = [Math.max(0, r), Math.max(0, o)], !ko(e) && (t.offsetWidth || t.offsetHeight || t.getClientRects().length) && Aa(
        "No map visible because the map container's width or height are 0."
      ));
    }
    const i = this.getSize();
    e && (!i || !Pe(e, i)) && (this.setSize(e), this.updateViewportSize_(e));
  }
  /**
   * Recomputes the viewport size and save it on the view object (if any)
   * @param {import("./size.js").Size|undefined} size The size.
   * @private
   */
  updateViewportSize_(t) {
    const e = this.getView();
    e && e.setViewportSize(t);
  }
}
function yd(n) {
  let t = null;
  n.keyboardEventTarget !== void 0 && (t = typeof n.keyboardEventTarget == "string" ? document.getElementById(n.keyboardEventTarget) : n.keyboardEventTarget);
  const e = {}, i = n.layers && typeof /** @type {?} */
  n.layers.getLayers == "function" ? (
    /** @type {LayerGroup} */
    n.layers
  ) : new bi({
    layers: (
      /** @type {Collection<import("./layer/Base.js").default>|Array<import("./layer/Base.js").default>} */
      n.layers
    )
  });
  e[yt.LAYERGROUP] = i, e[yt.TARGET] = n.target, e[yt.VIEW] = n.view instanceof ee ? n.view : new ee();
  let s;
  n.controls !== void 0 && (Array.isArray(n.controls) ? s = new Ut(n.controls.slice()) : ($(
    typeof /** @type {?} */
    n.controls.getArray == "function",
    "Expected `controls` to be an array or an `ol/Collection.js`"
  ), s = n.controls));
  let r;
  n.interactions !== void 0 && (Array.isArray(n.interactions) ? r = new Ut(n.interactions.slice()) : ($(
    typeof /** @type {?} */
    n.interactions.getArray == "function",
    "Expected `interactions` to be an array or an `ol/Collection.js`"
  ), r = n.interactions));
  let o;
  return n.overlays !== void 0 ? Array.isArray(n.overlays) ? o = new Ut(n.overlays.slice()) : ($(
    typeof /** @type {?} */
    n.overlays.getArray == "function",
    "Expected `overlays` to be an array or an `ol/Collection.js`"
  ), o = n.overlays) : o = new Ut(), {
    controls: s,
    interactions: r,
    keyboardEventTarget: t,
    overlays: o,
    values: e
  };
}
class Zr extends es {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {Options} [options] Tile options.
   */
  constructor(t, e, i) {
    super(), i = i || {}, this.tileCoord = t, this.state = e, this.key = "", this.transition_ = i.transition === void 0 ? 250 : i.transition, this.transitionStarts_ = {}, this.interpolate = !!i.interpolate;
  }
  /**
   * @protected
   */
  changed() {
    this.dispatchEvent(z.CHANGE);
  }
  /**
   * Called by the tile cache when the tile is removed from the cache due to expiry
   */
  release() {
    this.setState(O.EMPTY);
  }
  /**
   * @return {string} Key.
   */
  getKey() {
    return this.key + "/" + this.tileCoord;
  }
  /**
   * Get the tile coordinate for this tile.
   * @return {import("./tilecoord.js").TileCoord} The tile coordinate.
   * @api
   */
  getTileCoord() {
    return this.tileCoord;
  }
  /**
   * @return {import("./TileState.js").default} State.
   */
  getState() {
    return this.state;
  }
  /**
   * Sets the state of this tile. If you write your own {@link module:ol/Tile~LoadFunction tileLoadFunction} ,
   * it is important to set the state correctly to {@link module:ol/TileState~ERROR}
   * when the tile cannot be loaded. Otherwise the tile cannot be removed from
   * the tile queue and will block other requests.
   * @param {import("./TileState.js").default} state State.
   * @api
   */
  setState(t) {
    if (this.state !== O.EMPTY) {
      if (this.state !== O.ERROR && this.state > t)
        throw new Error("Tile load sequence violation");
      this.state = t, this.changed();
    }
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @abstract
   * @api
   */
  load() {
    j();
  }
  /**
   * Get the alpha value for rendering.
   * @param {string} id An id for the renderer.
   * @param {number} time The render frame time.
   * @return {number} A number between 0 and 1.
   */
  getAlpha(t, e) {
    if (!this.transition_)
      return 1;
    let i = this.transitionStarts_[t];
    if (!i)
      i = e, this.transitionStarts_[t] = i;
    else if (i === -1)
      return 1;
    const s = e - i + 1e3 / 60;
    return s >= this.transition_ ? 1 : La(s / this.transition_);
  }
  /**
   * Determine if a tile is in an alpha transition.  A tile is considered in
   * transition if tile.getAlpha() has not yet been called or has been called
   * and returned 1.
   * @param {string} id An id for the renderer.
   * @return {boolean} The tile is in transition.
   */
  inTransition(t) {
    return this.transition_ ? this.transitionStarts_[t] !== -1 : !1;
  }
  /**
   * Mark a transition as complete.
   * @param {string} id An id for the renderer.
   */
  endTransition(t) {
    this.transition_ && (this.transitionStarts_[t] = -1);
  }
  /**
   * @override
   */
  disposeInternal() {
    this.release(), super.disposeInternal();
  }
}
function fr(n) {
  return n instanceof Image || n instanceof HTMLCanvasElement || n instanceof HTMLVideoElement || n instanceof ImageBitmap ? n : null;
}
const Ed = new Error("disposed"), xd = [256, 256];
class jo extends Zr {
  /**
   * @param {Options} options Tile options.
   */
  constructor(t) {
    const e = O.IDLE;
    super(t.tileCoord, e, {
      transition: t.transition,
      interpolate: t.interpolate
    }), this.loader_ = t.loader, this.data_ = null, this.error_ = null, this.size_ = t.size || null, this.controller_ = t.controller || null;
  }
  /**
   * Get the tile size.
   * @return {import('./size.js').Size} Tile size.
   */
  getSize() {
    if (this.size_)
      return this.size_;
    const t = fr(this.data_);
    return t ? [t.width, t.height] : xd;
  }
  /**
   * Get the data for the tile.
   * @return {Data} Tile data.
   * @api
   */
  getData() {
    return this.data_;
  }
  /**
   * Get any loading error.
   * @return {Error} Loading error.
   * @api
   */
  getError() {
    return this.error_;
  }
  /**
   * Load the tile data.
   * @api
   * @override
   */
  load() {
    if (this.state !== O.IDLE && this.state !== O.ERROR)
      return;
    this.state = O.LOADING, this.changed();
    const t = this;
    this.loader_().then(function(e) {
      t.data_ = e, t.state = O.LOADED, t.changed();
    }).catch(function(e) {
      t.error_ = e, t.state = O.ERROR, t.changed();
    });
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    this.controller_ && (this.controller_.abort(Ed), this.controller_ = null), super.disposeInternal();
  }
}
class wl extends Zr {
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("./TileState.js").default} state State.
   * @param {string} src Image source URI.
   * @param {?string} crossOrigin Cross origin.
   * @param {import("./Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @param {import("./Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, i, s, r, o) {
    super(t, e, o), this.crossOrigin_ = s, this.src_ = i, this.key = i, this.image_ = new Image(), s !== null && (this.image_.crossOrigin = s), this.unlisten_ = null, this.tileLoadFunction_ = r;
  }
  /**
   * Get the HTML image element for this tile (may be a Canvas, Image, or Video).
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @api
   */
  getImage() {
    return this.image_;
  }
  /**
   * Sets an HTML image element for this tile (may be a Canvas or preloaded Image).
   * @param {HTMLCanvasElement|HTMLImageElement} element Element.
   */
  setImage(t) {
    this.image_ = t, this.state = O.LOADED, this.unlistenImage_(), this.changed();
  }
  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  handleImageError_() {
    this.state = O.ERROR, this.unlistenImage_(), this.image_ = wd(), this.changed();
  }
  /**
   * Tracks successful image load.
   *
   * @private
   */
  handleImageLoad_() {
    const t = (
      /** @type {HTMLImageElement} */
      this.image_
    );
    t.naturalWidth && t.naturalHeight ? this.state = O.LOADED : this.state = O.EMPTY, this.unlistenImage_(), this.changed();
  }
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   *
   * To retry loading tiles on failed requests, use a custom `tileLoadFunction`
   * that checks for error status codes and reloads only when the status code is
   * 408, 429, 500, 502, 503 and 504, and only when not too many retries have been
   * made already:
   *
   * ```js
   * const retryCodes = [408, 429, 500, 502, 503, 504];
   * const retries = {};
   * source.setTileLoadFunction((tile, src) => {
   *   const image = tile.getImage();
   *   fetch(src)
   *     .then((response) => {
   *       if (retryCodes.includes(response.status)) {
   *         retries[src] = (retries[src] || 0) + 1;
   *         if (retries[src] <= 3) {
   *           setTimeout(() => tile.load(), retries[src] * 1000);
   *         }
   *         return Promise.reject();
   *       }
   *       return response.blob();
   *     })
   *     .then((blob) => {
   *       const imageUrl = URL.createObjectURL(blob);
   *       image.src = imageUrl;
   *       setTimeout(() => URL.revokeObjectURL(imageUrl), 5000);
   *     })
   *     .catch(() => tile.setState(3)); // error
   * });
   * ```
   * @api
   * @override
   */
  load() {
    this.state == O.ERROR && (this.state = O.IDLE, this.image_ = new Image(), this.crossOrigin_ !== null && (this.image_.crossOrigin = this.crossOrigin_)), this.state == O.IDLE && (this.state = O.LOADING, this.changed(), this.tileLoadFunction_(this, this.src_), this.unlisten_ = Wu(
      this.image_,
      this.handleImageLoad_.bind(this),
      this.handleImageError_.bind(this)
    ));
  }
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  unlistenImage_() {
    this.unlisten_ && (this.unlisten_(), this.unlisten_ = null);
  }
  /**
   * @override
   */
  disposeInternal() {
    this.unlistenImage_(), this.image_ = null, super.disposeInternal();
  }
}
function wd() {
  const n = at(1, 1);
  return n.fillStyle = "rgba(0,0,0,0)", n.fillRect(0, 0, 1, 1), n.canvas;
}
class Ur {
  /**
   * @param {number} minX Minimum X.
   * @param {number} maxX Maximum X.
   * @param {number} minY Minimum Y.
   * @param {number} maxY Maximum Y.
   */
  constructor(t, e, i, s) {
    this.minX = t, this.maxX = e, this.minY = i, this.maxY = s;
  }
  /**
   * @param {import("./tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {boolean} Contains tile coordinate.
   */
  contains(t) {
    return this.containsXY(t[1], t[2]);
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Contains.
   */
  containsTileRange(t) {
    return this.minX <= t.minX && t.maxX <= this.maxX && this.minY <= t.minY && t.maxY <= this.maxY;
  }
  /**
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @return {boolean} Contains coordinate.
   */
  containsXY(t, e) {
    return this.minX <= t && t <= this.maxX && this.minY <= e && e <= this.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Equals.
   */
  equals(t) {
    return this.minX == t.minX && this.minY == t.minY && this.maxX == t.maxX && this.maxY == t.maxY;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   */
  extend(t) {
    t.minX < this.minX && (this.minX = t.minX), t.maxX > this.maxX && (this.maxX = t.maxX), t.minY < this.minY && (this.minY = t.minY), t.maxY > this.maxY && (this.maxY = t.maxY);
  }
  /**
   * @return {number} Height.
   */
  getHeight() {
    return this.maxY - this.minY + 1;
  }
  /**
   * @return {import("./size.js").Size} Size.
   */
  getSize() {
    return [this.getWidth(), this.getHeight()];
  }
  /**
   * @return {number} Width.
   */
  getWidth() {
    return this.maxX - this.minX + 1;
  }
  /**
   * @param {TileRange} tileRange Tile range.
   * @return {boolean} Intersects.
   */
  intersects(t) {
    return this.minX <= t.maxX && this.maxX >= t.minX && this.minY <= t.maxY && this.maxY >= t.minY;
  }
}
function oi(n, t, e, i, s) {
  return s !== void 0 ? (s.minX = n, s.maxX = t, s.minY = e, s.maxY = i, s) : new Ur(n, t, e, i);
}
let Bs;
const xi = [];
function Ho(n, t, e, i, s) {
  n.beginPath(), n.moveTo(0, 0), n.lineTo(t, e), n.lineTo(i, s), n.closePath(), n.save(), n.clip(), n.fillRect(0, 0, Math.max(t, i) + 1, Math.max(e, s)), n.restore();
}
function Vs(n, t) {
  return Math.abs(n[t * 4] - 210) > 2 || Math.abs(n[t * 4 + 3] - 0.75 * 255) > 2;
}
function Cd() {
  if (Bs === void 0) {
    const n = at(6, 6, xi);
    n.globalCompositeOperation = "lighter", n.fillStyle = "rgba(210, 0, 0, 0.75)", Ho(n, 4, 5, 4, 0), Ho(n, 4, 5, 0, 5);
    const t = n.getImageData(0, 0, 3, 3).data;
    Bs = Vs(t, 0) || Vs(t, 4) || Vs(t, 8), fs(n), xi.push(n.canvas);
  }
  return Bs;
}
function $o(n, t, e, i) {
  const s = cs(e, t, n);
  let r = yo(
    t,
    i,
    e
  );
  const o = t.getMetersPerUnit();
  o !== void 0 && (r *= o);
  const a = n.getMetersPerUnit();
  a !== void 0 && (r /= a);
  const l = n.getExtent();
  if (!l || Ri(l, s)) {
    const c = yo(n, r, s) / r;
    isFinite(c) && c > 0 && (r /= c);
  }
  return r;
}
function Rd(n, t, e, i) {
  const s = je(e);
  let r = $o(
    n,
    t,
    s,
    i
  );
  return (!isFinite(r) || r <= 0) && Ra(e, function(o) {
    return r = $o(
      n,
      t,
      o,
      i
    ), isFinite(r) && r > 0;
  }), r;
}
function Sd(n, t, e, i, s, r, o, a, l, c, h, u, d, f) {
  const g = at(
    Math.round(e * n),
    Math.round(e * t),
    xi
  );
  if (u || (g.imageSmoothingEnabled = !1), l.length === 0)
    return g.canvas;
  g.scale(e, e);
  function m(x) {
    return Math.round(x * e) / e;
  }
  g.globalCompositeOperation = "lighter";
  const _ = Yt();
  l.forEach(function(x, R, T) {
    oh(_, x.extent);
  });
  let p;
  const E = e / i, w = (u ? 1 : 1 + Math.pow(2, -24)) / E;
  p = at(
    Math.round(J(_) * E),
    Math.round(Rt(_) * E),
    xi
  ), u || (p.imageSmoothingEnabled = !1), l.forEach(function(x, R, T) {
    if (x.image.width > 0 && x.image.height > 0) {
      if (x.clipExtent) {
        p.save();
        const b = (x.clipExtent[0] - _[0]) * E, A = -(x.clipExtent[3] - _[3]) * E, M = J(x.clipExtent) * E, Y = Rt(x.clipExtent) * E;
        p.rect(
          u ? b : Math.round(b),
          u ? A : Math.round(A),
          u ? M : Math.round(b + M) - Math.round(b),
          u ? Y : Math.round(A + Y) - Math.round(A)
        ), p.clip();
      }
      const S = (x.extent[0] - _[0]) * E, v = -(x.extent[3] - _[3]) * E, L = J(x.extent) * E, k = Rt(x.extent) * E;
      p.drawImage(
        x.image,
        c,
        c,
        x.image.width - 2 * c,
        x.image.height - 2 * c,
        u ? S : Math.round(S),
        u ? v : Math.round(v),
        u ? L : Math.round(S + L) - Math.round(S),
        u ? k : Math.round(v + k) - Math.round(v)
      ), x.clipExtent && p.restore();
    }
  });
  const y = $e(o);
  return a.getTriangles().forEach(function(x, R, T) {
    const S = x.source, v = x.target;
    let L = S[0][0], k = S[0][1], b = S[1][0], A = S[1][1], M = S[2][0], Y = S[2][1];
    const F = m((v[0][0] - y[0]) / r), G = m(
      -(v[0][1] - y[1]) / r
    ), D = m((v[1][0] - y[0]) / r), K = m(
      -(v[1][1] - y[1]) / r
    ), V = m((v[2][0] - y[0]) / r), Q = m(
      -(v[2][1] - y[1]) / r
    ), I = L, _t = k;
    L = 0, k = 0, b -= I, A -= _t, M -= I, Y -= _t;
    const xt = [
      [b, A, 0, 0, D - F],
      [M, Y, 0, 0, V - F],
      [0, 0, b, A, K - G],
      [0, 0, M, Y, Q - G]
    ], st = sh(xt);
    if (!st)
      return;
    if (g.save(), g.beginPath(), Cd() || !u) {
      g.moveTo(D, K);
      const mt = 4, Jt = F - D, Kt = G - K;
      for (let bt = 0; bt < mt; bt++)
        g.lineTo(
          D + m((bt + 1) * Jt / mt),
          K + m(bt * Kt / (mt - 1))
        ), bt != mt - 1 && g.lineTo(
          D + m((bt + 1) * Jt / mt),
          K + m((bt + 1) * Kt / (mt - 1))
        );
      g.lineTo(V, Q);
    } else
      g.moveTo(D, K), g.lineTo(F, G), g.lineTo(V, Q);
    g.clip(), g.transform(
      st[0],
      st[2],
      st[1],
      st[3],
      F,
      G
    ), g.translate(
      _[0] - I,
      _[3] - _t
    );
    let Mt;
    if (p)
      Mt = p.canvas, g.scale(w, -w);
    else {
      const mt = l[0], Jt = mt.extent;
      Mt = mt.image, g.scale(
        J(Jt) / Mt.width,
        -Rt(Jt) / Mt.height
      );
    }
    g.drawImage(Mt, 0, 0), g.restore();
  }), p && (fs(p), xi.push(p.canvas)), h && (g.save(), g.globalCompositeOperation = "source-over", g.strokeStyle = "black", g.lineWidth = 1, a.getTriangles().forEach(function(x, R, T) {
    const S = x.target, v = (S[0][0] - y[0]) / r, L = -(S[0][1] - y[1]) / r, k = (S[1][0] - y[0]) / r, b = -(S[1][1] - y[1]) / r, A = (S[2][0] - y[0]) / r, M = -(S[2][1] - y[1]) / r;
    g.beginPath(), g.moveTo(k, b), g.lineTo(v, L), g.lineTo(A, M), g.closePath(), g.stroke();
  }), g.restore()), g.canvas;
}
const Td = 10, qo = 0.25;
class Id {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../extent.js").Extent} targetExtent Target extent to triangulate.
   * @param {import("../extent.js").Extent} maxSourceExtent Maximal source extent that can be used.
   * @param {number} errorThreshold Acceptable error (in source units).
   * @param {?number} destinationResolution The (optional) resolution of the destination.
   * @param {import("../transform.js").Transform} [sourceMatrix] Source transform matrix.
   */
  constructor(t, e, i, s, r, o, a) {
    this.sourceProj_ = t, this.targetProj_ = e;
    let l = {};
    const c = a ? Kh(
      (w) => dt(
        a,
        cs(w, this.targetProj_, this.sourceProj_)
      )
    ) : Bn(this.targetProj_, this.sourceProj_);
    this.transformInv_ = function(w) {
      const y = w[0] + "/" + w[1];
      return l[y] || (l[y] = c(w)), l[y];
    }, this.maxSourceExtent_ = s, this.errorThresholdSquared_ = r * r, this.triangles_ = [], this.wrapsXInSource_ = !1, this.canWrapXInSource_ = this.sourceProj_.canWrapX() && !!s && !!this.sourceProj_.getExtent() && J(s) >= J(this.sourceProj_.getExtent()), this.sourceWorldWidth_ = this.sourceProj_.getExtent() ? J(this.sourceProj_.getExtent()) : null, this.targetWorldWidth_ = this.targetProj_.getExtent() ? J(this.targetProj_.getExtent()) : null;
    const h = $e(i), u = os(i), d = rs(i), f = ss(i), g = this.transformInv_(h), m = this.transformInv_(u), _ = this.transformInv_(d), p = this.transformInv_(f), E = Td + (o ? Math.max(
      0,
      Math.ceil(
        Math.log2(
          ir(i) / (o * o * 256 * 256)
        )
      )
    ) : 0);
    if (this.addQuad_(
      h,
      u,
      d,
      f,
      g,
      m,
      _,
      p,
      E
    ), this.wrapsXInSource_) {
      let w = 1 / 0;
      this.triangles_.forEach(function(y, x, R) {
        w = Math.min(
          w,
          y.source[0][0],
          y.source[1][0],
          y.source[2][0]
        );
      }), this.triangles_.forEach((y) => {
        if (Math.max(
          y.source[0][0],
          y.source[1][0],
          y.source[2][0]
        ) - w > this.sourceWorldWidth_ / 2) {
          const x = [
            [y.source[0][0], y.source[0][1]],
            [y.source[1][0], y.source[1][1]],
            [y.source[2][0], y.source[2][1]]
          ];
          x[0][0] - w > this.sourceWorldWidth_ / 2 && (x[0][0] -= this.sourceWorldWidth_), x[1][0] - w > this.sourceWorldWidth_ / 2 && (x[1][0] -= this.sourceWorldWidth_), x[2][0] - w > this.sourceWorldWidth_ / 2 && (x[2][0] -= this.sourceWorldWidth_);
          const R = Math.min(
            x[0][0],
            x[1][0],
            x[2][0]
          );
          Math.max(
            x[0][0],
            x[1][0],
            x[2][0]
          ) - R < this.sourceWorldWidth_ / 2 && (y.source = x);
        }
      });
    }
    l = {};
  }
  /**
   * Adds triangle to the triangulation.
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @private
   */
  addTriangle_(t, e, i, s, r, o) {
    this.triangles_.push({
      source: [s, r, o],
      target: [t, e, i]
    });
  }
  /**
   * Adds quad (points in clock-wise order) to the triangulation
   * (and reprojects the vertices) if valid.
   * Performs quad subdivision if needed to increase precision.
   *
   * @param {import("../coordinate.js").Coordinate} a The target a coordinate.
   * @param {import("../coordinate.js").Coordinate} b The target b coordinate.
   * @param {import("../coordinate.js").Coordinate} c The target c coordinate.
   * @param {import("../coordinate.js").Coordinate} d The target d coordinate.
   * @param {import("../coordinate.js").Coordinate} aSrc The source a coordinate.
   * @param {import("../coordinate.js").Coordinate} bSrc The source b coordinate.
   * @param {import("../coordinate.js").Coordinate} cSrc The source c coordinate.
   * @param {import("../coordinate.js").Coordinate} dSrc The source d coordinate.
   * @param {number} maxSubdivision Maximal allowed subdivision of the quad.
   * @private
   */
  addQuad_(t, e, i, s, r, o, a, l, c) {
    const h = lo([r, o, a, l]), u = this.sourceWorldWidth_ ? J(h) / this.sourceWorldWidth_ : null, d = (
      /** @type {number} */
      this.sourceWorldWidth_
    ), f = this.sourceProj_.canWrapX() && u > 0.5 && u < 1;
    let g = !1;
    if (c > 0) {
      if (this.targetProj_.isGlobal() && this.targetWorldWidth_) {
        const _ = lo([t, e, i, s]);
        g = J(_) / this.targetWorldWidth_ > qo || g;
      }
      !f && this.sourceProj_.isGlobal() && u && (g = u > qo || g);
    }
    if (!g && this.maxSourceExtent_ && isFinite(h[0]) && isFinite(h[1]) && isFinite(h[2]) && isFinite(h[3]) && !It(h, this.maxSourceExtent_))
      return;
    let m = 0;
    if (!g && (!isFinite(r[0]) || !isFinite(r[1]) || !isFinite(o[0]) || !isFinite(o[1]) || !isFinite(a[0]) || !isFinite(a[1]) || !isFinite(l[0]) || !isFinite(l[1]))) {
      if (c > 0)
        g = !0;
      else if (m = (!isFinite(r[0]) || !isFinite(r[1]) ? 8 : 0) + (!isFinite(o[0]) || !isFinite(o[1]) ? 4 : 0) + (!isFinite(a[0]) || !isFinite(a[1]) ? 2 : 0) + (!isFinite(l[0]) || !isFinite(l[1]) ? 1 : 0), m != 1 && m != 2 && m != 4 && m != 8)
        return;
    }
    if (c > 0) {
      if (!g) {
        const _ = [(t[0] + i[0]) / 2, (t[1] + i[1]) / 2], p = this.transformInv_(_);
        let E;
        f ? E = (Be(r[0], d) + Be(a[0], d)) / 2 - Be(p[0], d) : E = (r[0] + a[0]) / 2 - p[0];
        const w = (r[1] + a[1]) / 2 - p[1];
        g = E * E + w * w > this.errorThresholdSquared_;
      }
      if (g) {
        if (Math.abs(t[0] - i[0]) <= Math.abs(t[1] - i[1])) {
          const _ = [(e[0] + i[0]) / 2, (e[1] + i[1]) / 2], p = this.transformInv_(_), E = [(s[0] + t[0]) / 2, (s[1] + t[1]) / 2], w = this.transformInv_(E);
          this.addQuad_(
            t,
            e,
            _,
            E,
            r,
            o,
            p,
            w,
            c - 1
          ), this.addQuad_(
            E,
            _,
            i,
            s,
            w,
            p,
            a,
            l,
            c - 1
          );
        } else {
          const _ = [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2], p = this.transformInv_(_), E = [(i[0] + s[0]) / 2, (i[1] + s[1]) / 2], w = this.transformInv_(E);
          this.addQuad_(
            t,
            _,
            E,
            s,
            r,
            p,
            w,
            l,
            c - 1
          ), this.addQuad_(
            _,
            e,
            i,
            E,
            p,
            o,
            a,
            w,
            c - 1
          );
        }
        return;
      }
    }
    if (f) {
      if (!this.canWrapXInSource_)
        return;
      this.wrapsXInSource_ = !0;
    }
    (m & 11) == 0 && this.addTriangle_(t, i, s, r, a, l), (m & 14) == 0 && this.addTriangle_(t, i, e, r, a, o), m && ((m & 13) == 0 && this.addTriangle_(e, s, t, o, l, r), (m & 7) == 0 && this.addTriangle_(e, s, i, o, l, a));
  }
  /**
   * Calculates extent of the `source` coordinates from all the triangles.
   *
   * @return {import("../extent.js").Extent} Calculated extent.
   */
  calculateSourceExtent() {
    const t = Yt();
    return this.triangles_.forEach(function(e, i, s) {
      const r = e.source;
      ji(t, r[0]), ji(t, r[1]), ji(t, r[2]);
    }), t;
  }
  /**
   * @return {Array<Triangle>} Array of the calculated triangles.
   */
  getTriangles() {
    return this.triangles_;
  }
}
const vd = 0.5;
class Cl extends Zr {
  /**
   * @param {import("../proj/Projection.js").default} sourceProj Source projection.
   * @param {import("../tilegrid/TileGrid.js").default} sourceTileGrid Source tile grid.
   * @param {import("../proj/Projection.js").default} targetProj Target projection.
   * @param {import("../tilegrid/TileGrid.js").default} targetTileGrid Target tile grid.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Coordinate of the tile.
   * @param {import("../tilecoord.js").TileCoord} wrappedTileCoord Coordinate of the tile wrapped in X.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} gutter Gutter of the source tiles.
   * @param {FunctionType} getTileFunction
   *     Function returning source tiles (z, x, y, pixelRatio).
   * @param {number} [errorThreshold] Acceptable reprojection error (in px).
   * @param {boolean} [renderEdges] Render reprojection edges.
   * @param {import("../Tile.js").Options} [options] Tile options.
   */
  constructor(t, e, i, s, r, o, a, l, c, h, u, d) {
    super(r, O.IDLE, d), this.renderEdges_ = u !== void 0 ? u : !1, this.pixelRatio_ = a, this.gutter_ = l, this.canvas_ = null, this.sourceTileGrid_ = e, this.targetTileGrid_ = s, this.wrappedTileCoord_ = o || r, this.sourceTiles_ = [], this.sourcesListenerKeys_ = null, this.sourceZ_ = 0, this.clipExtent_ = t.canWrapX() ? t.getExtent() : void 0;
    const f = s.getTileCoordExtent(
      this.wrappedTileCoord_
    ), g = this.targetTileGrid_.getExtent();
    let m = this.sourceTileGrid_.getExtent();
    const _ = g ? Ve(f, g) : f;
    if (ir(_) === 0) {
      this.state = O.EMPTY;
      return;
    }
    const p = t.getExtent();
    p && (m ? m = Ve(m, p) : m = p);
    const E = s.getResolution(
      this.wrappedTileCoord_[0]
    ), w = Rd(
      t,
      i,
      _,
      E
    );
    if (!isFinite(w) || w <= 0) {
      this.state = O.EMPTY;
      return;
    }
    const y = h !== void 0 ? h : vd;
    if (this.triangulation_ = new Id(
      t,
      i,
      _,
      m,
      w * y,
      E
    ), this.triangulation_.getTriangles().length === 0) {
      this.state = O.EMPTY;
      return;
    }
    this.sourceZ_ = e.getZForResolution(w);
    let x = this.triangulation_.calculateSourceExtent();
    if (m && (t.canWrapX() ? (x[1] = it(
      x[1],
      m[1],
      m[3]
    ), x[3] = it(
      x[3],
      m[1],
      m[3]
    )) : x = Ve(x, m)), !ir(x))
      this.state = O.EMPTY;
    else {
      let R = 0, T = 0;
      t.canWrapX() && (R = J(p), T = Math.floor(
        (x[0] - p[0]) / R
      )), Ia(
        x.slice(),
        t,
        !0
      ).forEach((v) => {
        const L = e.getTileRangeForExtentAndZ(
          v,
          this.sourceZ_
        );
        for (let k = L.minX; k <= L.maxX; k++)
          for (let b = L.minY; b <= L.maxY; b++) {
            const A = c(this.sourceZ_, k, b, a);
            if (A) {
              const M = T * R;
              this.sourceTiles_.push({ tile: A, offset: M });
            }
          }
        ++T;
      }), this.sourceTiles_.length === 0 && (this.state = O.EMPTY);
    }
  }
  /**
   * Get the HTML Canvas element for this tile.
   * @return {HTMLCanvasElement} Canvas.
   */
  getImage() {
    return this.canvas_;
  }
  /**
   * @private
   */
  reproject_() {
    const t = [];
    if (this.sourceTiles_.forEach((e) => {
      const i = e.tile;
      if (i && i.getState() == O.LOADED) {
        const s = this.sourceTileGrid_.getTileCoordExtent(i.tileCoord);
        s[0] += e.offset, s[2] += e.offset;
        const r = this.clipExtent_?.slice();
        r && (r[0] += e.offset, r[2] += e.offset), t.push({
          extent: s,
          clipExtent: r,
          image: i.getImage()
        });
      }
    }), this.sourceTiles_.length = 0, t.length === 0)
      this.state = O.ERROR;
    else {
      const e = this.wrappedTileCoord_[0], i = this.targetTileGrid_.getTileSize(e), s = typeof i == "number" ? i : i[0], r = typeof i == "number" ? i : i[1], o = this.targetTileGrid_.getResolution(e), a = this.sourceTileGrid_.getResolution(
        this.sourceZ_
      ), l = this.targetTileGrid_.getTileCoordExtent(
        this.wrappedTileCoord_
      );
      this.canvas_ = Sd(
        s,
        r,
        this.pixelRatio_,
        a,
        this.sourceTileGrid_.getExtent(),
        o,
        l,
        this.triangulation_,
        t,
        this.gutter_,
        this.renderEdges_,
        this.interpolate
      ), this.state = O.LOADED;
    }
    this.changed();
  }
  /**
   * Load not yet loaded URI.
   * @override
   */
  load() {
    if (this.state == O.IDLE) {
      this.state = O.LOADING, this.changed();
      let t = 0;
      this.sourcesListenerKeys_ = [], this.sourceTiles_.forEach(({ tile: e }) => {
        const i = e.getState();
        if (i == O.IDLE || i == O.LOADING) {
          t++;
          const s = U(e, z.CHANGE, (r) => {
            const o = e.getState();
            (o == O.LOADED || o == O.ERROR || o == O.EMPTY) && (tt(s), t--, t === 0 && (this.unlistenSources_(), this.reproject_()));
          });
          this.sourcesListenerKeys_.push(s);
        }
      }), t === 0 ? setTimeout(this.reproject_.bind(this), 0) : this.sourceTiles_.forEach(function({ tile: e }, i, s) {
        e.getState() == O.IDLE && e.load();
      });
    }
  }
  /**
   * @private
   */
  unlistenSources_() {
    this.sourcesListenerKeys_.forEach(tt), this.sourcesListenerKeys_ = null;
  }
  /**
   * Remove from the cache due to expiry
   * @override
   */
  release() {
    this.canvas_ && (fs(this.canvas_.getContext("2d")), xi.push(this.canvas_), this.canvas_ = null), super.release();
  }
}
class Ld {
  /**
   * @param {number} [highWaterMark] High water mark.
   */
  constructor(t) {
    this.highWaterMark = t !== void 0 ? t : 2048, this.count_ = 0, this.entries_ = {}, this.oldest_ = null, this.newest_ = null;
  }
  deleteOldest() {
    const t = this.pop();
    t instanceof ts && t.dispose();
  }
  /**
   * @return {boolean} Can expire cache.
   */
  canExpireCache() {
    return this.highWaterMark > 0 && this.getCount() > this.highWaterMark;
  }
  /**
   * Expire the cache. When the cache entry is a {@link module:ol/Disposable~Disposable},
   * the entry will be disposed.
   * @param {!Object<string, boolean>} [keep] Keys to keep. To be implemented by subclasses.
   */
  expireCache(t) {
    for (; this.canExpireCache(); )
      this.deleteOldest();
  }
  /**
   * FIXME empty description for jsdoc
   */
  clear() {
    for (; this.oldest_; )
      this.deleteOldest();
  }
  /**
   * @param {string} key Key.
   * @return {boolean} Contains key.
   */
  containsKey(t) {
    return this.entries_.hasOwnProperty(t);
  }
  /**
   * @param {function(T, string, LRUCache<T>): ?} f The function
   *     to call for every entry from the oldest to the newer. This function takes
   *     3 arguments (the entry value, the entry key and the LRUCache object).
   *     The return value is ignored.
   */
  forEach(t) {
    let e = this.oldest_;
    for (; e; )
      t(e.value_, e.key_, this), e = e.newer;
  }
  /**
   * @param {string} key Key.
   * @param {*} [options] Options (reserved for subclasses).
   * @return {T} Value.
   */
  get(t, e) {
    const i = this.entries_[t];
    return $(
      i !== void 0,
      "Tried to get a value for a key that does not exist in the cache"
    ), i === this.newest_ || (i === this.oldest_ ? (this.oldest_ = /** @type {Entry} */
    this.oldest_.newer, this.oldest_.older = null) : (i.newer.older = i.older, i.older.newer = i.newer), i.newer = null, i.older = this.newest_, this.newest_.newer = i, this.newest_ = i), i.value_;
  }
  /**
   * Remove an entry from the cache.
   * @param {string} key The entry key.
   * @return {T} The removed entry.
   */
  remove(t) {
    const e = this.entries_[t];
    return $(
      e !== void 0,
      "Tried to get a value for a key that does not exist in the cache"
    ), e === this.newest_ ? (this.newest_ = /** @type {Entry} */
    e.older, this.newest_ && (this.newest_.newer = null)) : e === this.oldest_ ? (this.oldest_ = /** @type {Entry} */
    e.newer, this.oldest_ && (this.oldest_.older = null)) : (e.newer.older = e.older, e.older.newer = e.newer), delete this.entries_[t], --this.count_, e.value_;
  }
  /**
   * @return {number} Count.
   */
  getCount() {
    return this.count_;
  }
  /**
   * @return {Array<string>} Keys.
   */
  getKeys() {
    const t = new Array(this.count_);
    let e = 0, i;
    for (i = this.newest_; i; i = i.older)
      t[e++] = i.key_;
    return t;
  }
  /**
   * @return {Array<T>} Values.
   */
  getValues() {
    const t = new Array(this.count_);
    let e = 0, i;
    for (i = this.newest_; i; i = i.older)
      t[e++] = i.value_;
    return t;
  }
  /**
   * @return {T} Last value.
   */
  peekLast() {
    return this.oldest_.value_;
  }
  /**
   * @return {string} Last key.
   */
  peekLastKey() {
    return this.oldest_.key_;
  }
  /**
   * Get the key of the newest item in the cache.  Throws if the cache is empty.
   * @return {string} The newest key.
   */
  peekFirstKey() {
    return this.newest_.key_;
  }
  /**
   * Return an entry without updating least recently used time.
   * @param {string} key Key.
   * @return {T|undefined} Value.
   */
  peek(t) {
    return this.entries_[t]?.value_;
  }
  /**
   * @return {T} value Value.
   */
  pop() {
    const t = this.oldest_;
    return delete this.entries_[t.key_], t.newer && (t.newer.older = null), this.oldest_ = /** @type {Entry} */
    t.newer, this.oldest_ || (this.newest_ = null), --this.count_, t.value_;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  replace(t, e) {
    this.get(t), this.entries_[t].value_ = e;
  }
  /**
   * @param {string} key Key.
   * @param {T} value Value.
   */
  set(t, e) {
    $(
      !(t in this.entries_),
      "Tried to set a value for a key that is used already"
    );
    const i = {
      key_: t,
      newer: null,
      older: this.newest_,
      value_: e
    };
    this.newest_ ? this.newest_.newer = i : this.oldest_ = i, this.newest_ = i, this.entries_[t] = i, ++this.count_;
  }
  /**
   * Set a maximum number of entries for the cache.
   * @param {number} size Cache size.
   * @api
   */
  setSize(t) {
    this.highWaterMark = t;
  }
}
function qn(n, t, e, i) {
  return i !== void 0 ? (i[0] = n, i[1] = t, i[2] = e, i) : [n, t, e];
}
function Ad(n, t, e) {
  return n + "/" + t + "/" + e;
}
function Md(n) {
  return bd(n[0], n[1], n[2]);
}
function bd(n, t, e) {
  return (t << n) + e;
}
function Pd(n, t) {
  const e = n[0], i = n[1], s = n[2];
  if (t.getMinZoom() > e || e > t.getMaxZoom())
    return !1;
  const r = t.getFullTileRange(e);
  return r ? r.containsXY(i, s) : !0;
}
class Rl {
  constructor() {
    this.instructions_ = [], this.zIndex = 0, this.offset_ = 0, this.context_ = /** @type {ZIndexContextProxy} */
    new Proxy(Zn(), {
      get: (t, e) => {
        if (typeof /** @type {*} */
        Zn()[e] == "function")
          return this.push_(e), this.pushMethodArgs_;
      },
      set: (t, e, i) => (this.push_(e, i), !0)
    });
  }
  /**
   * @param {...*} args Arguments to push to the instructions array.
   * @private
   */
  push_(...t) {
    const e = this.instructions_, i = this.zIndex + this.offset_;
    e[i] || (e[i] = []), e[i].push(...t);
  }
  /**
   * @private
   * @param {...*} args Args.
   * @return {ZIndexContext} This.
   */
  pushMethodArgs_ = (...t) => (this.push_(t), this);
  /**
   * Push a function that renders to the context directly.
   * @param {function(CanvasRenderingContext2D): void} render Function.
   */
  pushFunction(t) {
    this.push_(t);
  }
  /**
   * Get a proxy for CanvasRenderingContext2D which does not support getting state
   * (e.g. `context.globalAlpha`, which will return `undefined`). To set state, if it relies on a
   * previous state (e.g. `context.globalAlpha = context.globalAlpha / 2`), set a function,
   * e.g. `context.globalAlpha = (context) => context.globalAlpha / 2`.
   * @return {ZIndexContextProxy} Context.
   */
  getContext() {
    return this.context_;
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   */
  draw(t) {
    this.instructions_.forEach((e) => {
      for (let i = 0, s = e.length; i < s; ++i) {
        const r = e[i];
        if (typeof r == "function") {
          r(t);
          continue;
        }
        const o = e[++i];
        if (typeof /** @type {*} */
        t[r] == "function")
          t[r](...o);
        else {
          if (typeof o == "function") {
            t[r] = o(t);
            continue;
          }
          t[r] = o;
        }
      }
    });
  }
  clear() {
    this.instructions_.length = 0, this.zIndex = 0, this.offset_ = 0;
  }
  /**
   * Offsets the zIndex by the highest current zIndex. Useful for rendering multiple worlds or tiles, to
   * avoid conflicting context.clip() or context.save()/restore() calls.
   */
  offset() {
    this.offset_ = this.instructions_.length, this.zIndex = 0;
  }
}
const Od = 5;
class Dd extends gn {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(), this.ready = !0, this.boundHandleImageChange_ = this.handleImageChange_.bind(this), this.layer_ = t, this.staleKeys_ = new Array(), this.maxStaleKeys = Od;
  }
  /**
   * @return {Array<string>} Get the list of stale keys.
   */
  getStaleKeys() {
    return this.staleKeys_;
  }
  /**
   * @param {string} key The new stale key.
   */
  prependStaleKey(t) {
    this.staleKeys_.unshift(t), this.staleKeys_.length > this.maxStaleKeys && (this.staleKeys_.length = this.maxStaleKeys);
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../Feature").FeatureLike>>} Promise that resolves with
   * an array of features.
   */
  getFeatures(t) {
    return j();
  }
  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   */
  getData(t) {
    return null;
  }
  /**
   * Determine whether render should be called.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   */
  prepareFrame(t) {
    return j();
  }
  /**
   * Render the layer.
   * @abstract
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement|null} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   */
  renderFrame(t, e) {
    return j();
  }
  /**
   * @abstract
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("./vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("./Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, s, r) {
  }
  /**
   * @return {LayerType} Layer.
   */
  getLayer() {
    return this.layer_;
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   * @abstract
   */
  handleFontsChanged() {
  }
  /**
   * Handle changes in image state.
   * @param {import("../events/Event.js").default} event Image change event.
   * @private
   */
  handleImageChange_(t) {
    const e = (
      /** @type {import("../Image.js").default} */
      t.target
    );
    (e.getState() === X.LOADED || e.getState() === X.ERROR) && this.renderIfReadyAndVisible();
  }
  /**
   * Load the image if not already loaded, and register the image change
   * listener if needed.
   * @param {import("../Image.js").default} image Image.
   * @return {boolean} `true` if the image is already loaded, `false` otherwise.
   * @protected
   */
  loadImage(t) {
    let e = t.getState();
    return e != X.LOADED && e != X.ERROR && t.addEventListener(z.CHANGE, this.boundHandleImageChange_), e == X.IDLE && (t.load(), e = t.getState()), e == X.LOADED;
  }
  /**
   * @protected
   */
  renderIfReadyAndVisible() {
    const t = this.getLayer();
    t && t.getVisible() && t.getSourceState() === "ready" && t.changed();
  }
  /**
   * @param {import("../Map.js").FrameState} frameState Frame state.
   */
  renderDeferred(t) {
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    delete this.layer_, super.disposeInternal();
  }
}
const Jo = [];
let di = null;
function Fd() {
  di = at(1, 1, void 0, {
    willReadFrequently: !0
  });
}
class Sl extends Dd {
  /**
   * @param {LayerType} layer Layer.
   */
  constructor(t) {
    super(t), this.container = null, this.renderedResolution, this.tempTransform = jt(), this.pixelTransform = jt(), this.inversePixelTransform = jt(), this.context = null, this.deferredContext_ = null, this.containerReused = !1, this.frameState = null;
  }
  /**
   * @param {import('../../DataTile.js').ImageLike} image Image.
   * @param {number} col The column index.
   * @param {number} row The row index.
   * @return {Uint8ClampedArray|null} The image data.
   */
  getImageData(t, e, i) {
    di || Fd(), di.clearRect(0, 0, 1, 1);
    let s;
    try {
      di.drawImage(t, e, i, 1, 1, 0, 0, 1, 1), s = di.getImageData(0, 0, 1, 1).data;
    } catch {
      return di = null, null;
    }
    return s;
  }
  /**
   * @param {import('../../Map.js').FrameState} frameState Frame state.
   * @return {string} Background color.
   */
  getBackground(t) {
    let i = this.getLayer().getBackground();
    return typeof i == "function" && (i = i(t.viewState.resolution)), i || void 0;
  }
  /**
   * Get a rendering container from an existing target, if compatible.
   * @param {HTMLElement} target Potential render target.
   * @param {string} transform CSS transform matrix.
   * @param {string} [backgroundColor] Background color.
   */
  useContainer(t, e, i) {
    const s = this.getLayer().getClassName();
    let r, o;
    if (t && t.className === s && (!i || t && t.style.backgroundColor && Pe(
      Ti(t.style.backgroundColor),
      Ti(i)
    ))) {
      const a = t.firstElementChild;
      a instanceof HTMLCanvasElement && (o = a.getContext("2d"));
    }
    if (o && Hh(o.canvas.style.transform, e) ? (this.container = t, this.context = o, this.containerReused = !0) : this.containerReused ? (this.container = null, this.context = null, this.containerReused = !1) : this.container && (this.container.style.backgroundColor = null), !this.container) {
      r = document.createElement("div"), r.className = s;
      let a = r.style;
      a.position = "absolute", a.width = "100%", a.height = "100%", o = at();
      const l = o.canvas;
      r.appendChild(l), a = l.style, a.position = "absolute", a.left = "0", a.transformOrigin = "top left", this.container = r, this.context = o;
    }
    !this.containerReused && i && !this.container.style.backgroundColor && (this.container.style.backgroundColor = i);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent Clip extent.
   * @protected
   */
  clipUnrotated(t, e, i) {
    const s = $e(i), r = os(i), o = rs(i), a = ss(i);
    dt(e.coordinateToPixelTransform, s), dt(e.coordinateToPixelTransform, r), dt(e.coordinateToPixelTransform, o), dt(e.coordinateToPixelTransform, a);
    const l = this.inversePixelTransform;
    dt(l, s), dt(l, r), dt(l, o), dt(l, a), t.save(), t.beginPath(), t.moveTo(Math.round(s[0]), Math.round(s[1])), t.lineTo(Math.round(r[0]), Math.round(r[1])), t.lineTo(Math.round(o[0]), Math.round(o[1])), t.lineTo(Math.round(a[0]), Math.round(a[1])), t.clip();
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @protected
   */
  prepareContainer(t, e) {
    const i = t.extent, s = t.viewState.resolution, r = t.viewState.rotation, o = t.pixelRatio, a = Math.round(J(i) / s * o), l = Math.round(Rt(i) / s * o);
    pe(
      this.pixelTransform,
      t.size[0] / 2,
      t.size[1] / 2,
      1 / o,
      1 / o,
      r,
      -a / 2,
      -l / 2
    ), Ga(this.inversePixelTransform, this.pixelTransform);
    const c = jh(this.pixelTransform);
    if (this.useContainer(e, c, this.getBackground(t)), !this.containerReused) {
      const h = this.context.canvas;
      h.width != a || h.height != l ? (h.width = a, h.height = l) : this.context.clearRect(0, 0, a, l), c !== h.style.transform && (h.style.transform = c);
    }
  }
  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @private
   */
  dispatchRenderEvent_(t, e, i) {
    const s = this.getLayer();
    if (s.hasListener(t)) {
      const r = new yl(
        t,
        this.inversePixelTransform,
        i,
        e
      );
      s.dispatchEvent(r);
    }
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  preRender(t, e) {
    this.frameState = e, !e.declutter && this.dispatchRenderEvent_(Gt.PRERENDER, t, e);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @protected
   */
  postRender(t, e) {
    e.declutter || this.dispatchRenderEvent_(Gt.POSTRENDER, t, e);
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   */
  renderDeferredInternal(t) {
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import('../../render/canvas/ZIndexContext.js').ZIndexContextProxy} Context.
   */
  getRenderContext(t) {
    return t.declutter && !this.deferredContext_ && (this.deferredContext_ = new Rl()), t.declutter ? this.deferredContext_.getContext() : this.context;
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderDeferred(t) {
    t.declutter && (this.dispatchRenderEvent_(
      Gt.PRERENDER,
      this.context,
      t
    ), t.declutter && this.deferredContext_ && (this.deferredContext_.draw(this.context), this.deferredContext_.clear()), this.renderDeferredInternal(t), this.dispatchRenderEvent_(
      Gt.POSTRENDER,
      this.context,
      t
    ));
  }
  /**
   * Creates a transform for rendering to an element that will be rotated after rendering.
   * @param {import("../../coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} width Width of the rendered element (in pixels).
   * @param {number} height Height of the rendered element (in pixels).
   * @param {number} offsetX Offset on the x-axis in view coordinates.
   * @protected
   * @return {!import("../../transform.js").Transform} Transform.
   */
  getRenderTransform(t, e, i, s, r, o, a) {
    const l = r / 2, c = o / 2, h = s / e, u = -h, d = -t[0] + a, f = -t[1];
    return pe(
      this.tempTransform,
      l,
      c,
      h,
      u,
      -i,
      d,
      f
    );
  }
  /**
   * Clean up.
   * @override
   */
  disposeInternal() {
    delete this.frameState, super.disposeInternal();
  }
}
function Zs(n, t, e, i) {
  return `${n},${Ad(t, e, i)}`;
}
function Us(n, t, e) {
  if (!(e in n))
    return n[e] = /* @__PURE__ */ new Set([t]), !0;
  const i = n[e], s = i.has(t);
  return s || i.add(t), !s;
}
function kd(n, t, e) {
  const i = n[e];
  return i ? i.delete(t) : !1;
}
function Qo(n, t) {
  const e = n.layerStatesArray[n.layerIndex];
  e.extent && (t = Ve(
    t,
    ve(e.extent, n.viewState.projection)
  ));
  const i = (
    /** @type {import("../../source/Tile.js").default} */
    e.layer.getRenderSource()
  );
  if (!i.getWrapX()) {
    const s = i.getTileGridForProjection(n.viewState.projection).getExtent();
    s && (t = Ve(t, s));
  }
  return t;
}
class Nd extends Sl {
  /**
   * @param {LayerType} tileLayer Tile layer.
   * @param {Options} [options] Options.
   */
  constructor(t, e) {
    super(t), e = e || {}, this.extentChanged = !0, this.renderComplete = !1, this.renderedExtent_ = null, this.renderedPixelRatio, this.renderedProjection = null, this.renderedRevision_, this.renderedTiles = [], this.renderedSourceKey_, this.renderedSourceRevision_, this.tempExtent = Yt(), this.tempTileRange_ = new Ur(0, 0, 0, 0), this.tempTileCoord_ = qn(0, 0, 0);
    const i = e.cacheSize !== void 0 ? e.cacheSize : 512;
    this.tileCache_ = new Ld(i), this.maxStaleKeys = i * 0.5;
  }
  /**
   * @return {LRUCache} Tile cache.
   */
  getTileCache() {
    return this.tileCache_;
  }
  /**
   * Get a tile from the cache or create one if needed.
   *
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import("../../Tile.js").default|null} Tile (or null if outside source extent).
   * @protected
   */
  getOrCreateTile(t, e, i, s) {
    const r = this.tileCache_, a = this.getLayer().getSource(), l = Zs(a.getKey(), t, e, i);
    let c;
    if (r.containsKey(l))
      c = r.get(l);
    else {
      if (c = a.getTile(
        t,
        e,
        i,
        s.pixelRatio,
        s.viewState.projection
      ), !c)
        return null;
      r.set(l, c);
    }
    return c;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {import("../../Tile.js").default|null} Tile (or null if outside source extent).
   * @protected
   */
  getTile(t, e, i, s) {
    const r = this.getOrCreateTile(t, e, i, s);
    return r || null;
  }
  /**
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray} Data at the pixel location.
   * @override
   */
  getData(t) {
    const e = this.frameState;
    if (!e)
      return null;
    const i = this.getLayer(), s = dt(
      e.pixelToCoordinateTransform,
      t.slice()
    ), r = i.getExtent();
    if (r && !Ri(r, s))
      return null;
    const o = e.viewState, a = i.getRenderSource(), l = a.getTileGridForProjection(o.projection), c = a.getTilePixelRatio(e.pixelRatio);
    for (let h = l.getZForResolution(o.resolution); h >= l.getMinZoom(); --h) {
      const u = l.getTileCoordForCoordAndZ(s, h), d = this.getTile(h, u[1], u[2], e);
      if (!d || d.getState() !== O.LOADED)
        continue;
      const f = l.getOrigin(h), g = Lt(l.getTileSize(h)), m = l.getResolution(h);
      let _;
      if (d instanceof wl || d instanceof Cl)
        _ = d.getImage();
      else if (d instanceof jo) {
        if (_ = fr(d.getData()), !_)
          continue;
      } else
        continue;
      const p = Math.floor(
        c * ((s[0] - f[0]) / m - u[1] * g[0])
      ), E = Math.floor(
        c * ((f[1] - s[1]) / m - u[2] * g[1])
      ), w = Math.round(
        c * a.getGutterForProjection(o.projection)
      );
      return this.getImageData(_, p + w, E + w);
    }
    return null;
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   * @override
   */
  prepareFrame(t) {
    this.renderedProjection ? t.viewState.projection !== this.renderedProjection && (this.tileCache_.clear(), this.renderedProjection = t.viewState.projection) : this.renderedProjection = t.viewState.projection;
    const e = this.getLayer().getSource();
    if (!e)
      return !1;
    const i = e.getRevision();
    return this.renderedRevision_ ? this.renderedRevision_ !== i && (this.renderedRevision_ = i, this.renderedSourceKey_ === e.getKey() && this.tileCache_.clear()) : this.renderedRevision_ = i, !0;
  }
  /**
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent The extent to be rendered.
   * @param {number} initialZ The zoom level.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @param {number} preload Number of additional levels to load.
   */
  enqueueTiles(t, e, i, s, r) {
    const o = t.viewState, a = this.getLayer(), l = a.getRenderSource(), c = l.getTileGridForProjection(o.projection), h = B(l);
    h in t.wantedTiles || (t.wantedTiles[h] = {});
    const u = t.wantedTiles[h], d = a.getMapInternal(), f = Math.max(
      i - r,
      c.getMinZoom(),
      c.getZForResolution(
        Math.min(
          a.getMaxResolution(),
          d ? d.getView().getResolutionForZoom(Math.max(a.getMinZoom(), 0)) : c.getResolution(0)
        ),
        l.zDirection
      )
    ), g = o.rotation, m = g ? Sa(
      o.center,
      o.resolution,
      g,
      t.size
    ) : void 0;
    for (let _ = i; _ >= f; --_) {
      const p = c.getTileRangeForExtentAndZ(
        e,
        _,
        this.tempTileRange_
      ), E = c.getResolution(_);
      for (let w = p.minX; w <= p.maxX; ++w)
        for (let y = p.minY; y <= p.maxY; ++y) {
          if (g && !c.tileCoordIntersectsViewport([_, w, y], m))
            continue;
          const x = this.getTile(_, w, y, t);
          if (!x || !Us(s, x, _))
            continue;
          const T = x.getKey();
          if (u[T] = !0, x.getState() === O.IDLE && !t.tileQueue.isKeyQueued(T)) {
            const S = qn(_, w, y, this.tempTileCoord_);
            t.tileQueue.enqueue([
              x,
              h,
              c.getTileCoordCenter(S),
              E
            ]);
          }
        }
    }
  }
  /**
   * Look for tiles covering the provided tile coordinate at an alternate
   * zoom level.  Loaded tiles will be added to the provided tile texture lookup.
   * @param {import("../../tilecoord.js").TileCoord} tileCoord The target tile coordinate.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @return {boolean} The tile coordinate is covered by loaded tiles at the alternate zoom level.
   * @private
   */
  findStaleTile_(t, e) {
    const i = this.tileCache_, s = t[0], r = t[1], o = t[2], a = this.getStaleKeys();
    for (let l = 0; l < a.length; ++l) {
      const c = Zs(a[l], s, r, o);
      if (i.containsKey(c)) {
        const h = i.peek(c);
        if (h.getState() === O.LOADED)
          return h.endTransition(B(this)), Us(e, h, s), !0;
      }
    }
    return !1;
  }
  /**
   * Look for tiles covering the provided tile coordinate at an alternate
   * zoom level.  Loaded tiles will be added to the provided tile texture lookup.
   * @param {import("../../tilegrid/TileGrid.js").default} tileGrid The tile grid.
   * @param {import("../../tilecoord.js").TileCoord} tileCoord The target tile coordinate.
   * @param {number} altZ The alternate zoom level.
   * @param {TileLookup} tilesByZ Lookup of tiles by zoom level.
   * @return {boolean} The tile coordinate is covered by loaded tiles at the alternate zoom level.
   * @private
   */
  findAltTiles_(t, e, i, s) {
    const r = t.getTileRangeForTileCoordAndZ(
      e,
      i,
      this.tempTileRange_
    );
    if (!r)
      return !1;
    let o = !0;
    const a = this.tileCache_, c = this.getLayer().getRenderSource().getKey();
    for (let h = r.minX; h <= r.maxX; ++h)
      for (let u = r.minY; u <= r.maxY; ++u) {
        const d = Zs(c, i, h, u);
        let f = !1;
        if (a.containsKey(d)) {
          const g = a.peek(d);
          g.getState() === O.LOADED && (Us(s, g, i), f = !0);
        }
        f || (o = !1);
      }
    return o;
  }
  /**
   * Render the layer.
   *
   * The frame rendering logic has three parts:
   *
   *  1. Enqueue tiles
   *  2. Find alt tiles for those that are not yet loaded
   *  3. Render loaded tiles
   *
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   * @override
   */
  renderFrame(t, e) {
    this.renderComplete = !0;
    const i = t.layerStatesArray[t.layerIndex], s = t.viewState, r = s.projection, o = s.resolution, a = s.center, l = t.pixelRatio, c = this.getLayer(), h = c.getSource(), u = h.getTileGridForProjection(r), d = u.getZForResolution(o, h.zDirection), f = u.getResolution(d), g = h.getKey();
    this.renderedSourceKey_ ? this.renderedSourceKey_ !== g && (this.prependStaleKey(this.renderedSourceKey_), this.renderedSourceKey_ = g) : this.renderedSourceKey_ = g;
    let m = t.extent;
    const _ = h.getTilePixelRatio(l);
    this.prepareContainer(t, e);
    const p = this.context.canvas.width, E = this.context.canvas.height, w = i.extent && ve(i.extent);
    w && (m = Ve(
      m,
      ve(i.extent)
    ));
    const y = f * p / 2 / _, x = f * E / 2 / _, R = [
      a[0] - y,
      a[1] - x,
      a[0] + y,
      a[1] + x
    ], T = {};
    this.renderedTiles.length = 0;
    const S = c.getPreload();
    if (t.nextExtent) {
      const D = u.getZForResolution(
        s.nextResolution,
        h.zDirection
      ), K = Qo(t, t.nextExtent);
      this.enqueueTiles(t, K, D, T, S);
    }
    const v = Qo(t, m);
    if (this.enqueueTiles(t, v, d, T, 0), S > 0 && setTimeout(() => {
      this.enqueueTiles(
        t,
        v,
        d - 1,
        T,
        S - 1
      );
    }, 0), !(d in T))
      return this.container;
    const L = B(this), k = t.time;
    for (const D of T[d]) {
      const K = D.getState();
      if (K === O.EMPTY)
        continue;
      const V = D.tileCoord;
      if (K === O.LOADED && D.getAlpha(L, k) === 1) {
        D.endTransition(L);
        continue;
      }
      if (K !== O.ERROR && (this.renderComplete = !1), this.findStaleTile_(V, T)) {
        kd(T, D, d), t.animate = !0;
        continue;
      }
      if (this.findAltTiles_(
        u,
        V,
        d + 1,
        T
      ))
        continue;
      const _t = u.getMinZoom();
      for (let xt = d - 1; xt >= _t && !this.findAltTiles_(
        u,
        V,
        xt,
        T
      ); --xt)
        ;
    }
    const b = f / o * l / _, A = this.getRenderContext(t);
    pe(
      this.tempTransform,
      p / 2,
      E / 2,
      b,
      b,
      0,
      -p / 2,
      -E / 2
    ), i.extent && this.clipUnrotated(A, t, w), h.getInterpolate() || (A.imageSmoothingEnabled = !1), this.preRender(A, t);
    const M = Object.keys(T).map(Number);
    M.sort(ge);
    let Y;
    const F = [], G = [];
    for (let D = M.length - 1; D >= 0; --D) {
      const K = M[D], V = h.getTilePixelSize(
        K,
        l,
        r
      ), I = u.getResolution(K) / f, _t = V[0] * I * b, xt = V[1] * I * b, st = u.getTileCoordForCoordAndZ(
        $e(R),
        K
      ), Mt = u.getTileCoordExtent(st), mt = dt(this.tempTransform, [
        _ * (Mt[0] - R[0]) / f,
        _ * (R[3] - Mt[3]) / f
      ]), Jt = _ * h.getGutterForProjection(r);
      for (const Kt of T[K]) {
        if (Kt.getState() !== O.LOADED)
          continue;
        const bt = Kt.tileCoord, En = st[1] - bt[1], Es = Math.round(mt[0] - (En - 1) * _t), Oi = st[2] - bt[2], Oe = Math.round(mt[1] - (Oi - 1) * xt), Pt = Math.round(mt[0] - En * _t), Qt = Math.round(mt[1] - Oi * xt), Je = Es - Pt, Qe = Oe - Qt, Di = M.length === 1;
        let De = !1;
        Y = [Pt, Qt, Pt + Je, Qt, Pt + Je, Qt + Qe, Pt, Qt + Qe];
        for (let ti = 0, ei = F.length; ti < ei; ++ti)
          if (!Di && K < G[ti]) {
            const ct = F[ti];
            It(
              [Pt, Qt, Pt + Je, Qt + Qe],
              [ct[0], ct[3], ct[4], ct[7]]
            ) && (De || (A.save(), De = !0), A.beginPath(), A.moveTo(Y[0], Y[1]), A.lineTo(Y[2], Y[3]), A.lineTo(Y[4], Y[5]), A.lineTo(Y[6], Y[7]), A.moveTo(ct[6], ct[7]), A.lineTo(ct[4], ct[5]), A.lineTo(ct[2], ct[3]), A.lineTo(ct[0], ct[1]), A.clip());
          }
        F.push(Y), G.push(K), this.drawTile(Kt, t, Pt, Qt, Je, Qe, Jt, Di), De && A.restore(), this.renderedTiles.unshift(Kt), this.updateUsedTiles(t.usedTiles, h, Kt);
      }
    }
    if (this.renderedResolution = f, this.extentChanged = !this.renderedExtent_ || !tn(this.renderedExtent_, R), this.renderedExtent_ = R, this.renderedPixelRatio = l, this.postRender(this.context, t), i.extent && A.restore(), A.imageSmoothingEnabled = !0, this.renderComplete) {
      const D = (K, V) => {
        const Q = B(h), I = V.wantedTiles[Q], _t = I ? Object.keys(I).length : 0;
        this.updateCacheSize(_t), this.tileCache_.expireCache();
      };
      t.postRenderFunctions.push(D);
    }
    return this.container;
  }
  /**
   * Increases the cache size if needed
   * @param {number} tileCount Minimum number of tiles needed.
   */
  updateCacheSize(t) {
    this.tileCache_.highWaterMark = Math.max(
      this.tileCache_.highWaterMark,
      t * 2
    );
  }
  /**
   * @param {import("../../Tile.js").default} tile Tile.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} x Left of the tile.
   * @param {number} y Top of the tile.
   * @param {number} w Width of the tile.
   * @param {number} h Height of the tile.
   * @param {number} gutter Tile gutter.
   * @param {boolean} transition Apply an alpha transition.
   * @protected
   */
  drawTile(t, e, i, s, r, o, a, l) {
    let c;
    if (t instanceof jo) {
      if (c = fr(t.getData()), !c)
        throw new Error("Rendering array data is not yet supported");
    } else
      c = this.getTileImage(
        /** @type {import("../../ImageTile.js").default} */
        t
      );
    if (!c)
      return;
    const h = this.getRenderContext(e), u = B(this), d = e.layerStatesArray[e.layerIndex], f = d.opacity * (l ? t.getAlpha(u, e.time) : 1), g = f !== h.globalAlpha;
    g && (h.save(), h.globalAlpha = f), h.drawImage(
      c,
      a,
      a,
      c.width - 2 * a,
      c.height - 2 * a,
      i,
      s,
      r,
      o
    ), g && h.restore(), f !== d.opacity ? e.animate = !0 : l && t.endTransition(u);
  }
  /**
   * @return {HTMLCanvasElement} Image
   */
  getImage() {
    const t = this.context;
    return t ? t.canvas : null;
  }
  /**
   * Get the image from a tile.
   * @param {import("../../ImageTile.js").default} tile Tile.
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @protected
   */
  getTileImage(t) {
    return t.getImage();
  }
  /**
   * @param {!Object<string, !Object<string, boolean>>} usedTiles Used tiles.
   * @param {import("../../source/Tile.js").default} tileSource Tile source.
   * @param {import('../../Tile.js').default} tile Tile.
   * @protected
   */
  updateUsedTiles(t, e, i) {
    const s = B(e);
    s in t || (t[s] = {}), t[s][i.getKey()] = !0;
  }
}
const Pn = {
  PRELOAD: "preload",
  USE_INTERIM_TILES_ON_ERROR: "useInterimTilesOnError"
};
class Gd extends gs {
  /**
   * @param {Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(t) {
    t = t || {};
    const e = Object.assign({}, t), i = t.cacheSize;
    delete t.cacheSize, delete e.preload, delete e.useInterimTilesOnError, super(e), this.on, this.once, this.un, this.cacheSize_ = i, this.setPreload(t.preload !== void 0 ? t.preload : 0), this.setUseInterimTilesOnError(
      t.useInterimTilesOnError !== void 0 ? t.useInterimTilesOnError : !0
    );
  }
  /**
   * @return {number|undefined} The suggested cache size
   * @protected
   */
  getCacheSize() {
    return this.cacheSize_;
  }
  /**
   * Return the level as number to which we will preload tiles up to.
   * @return {number} The level to preload tiles up to.
   * @observable
   * @api
   */
  getPreload() {
    return (
      /** @type {number} */
      this.get(Pn.PRELOAD)
    );
  }
  /**
   * Set the level as number to which we will preload tiles up to.
   * @param {number} preload The level to preload tiles up to.
   * @observable
   * @api
   */
  setPreload(t) {
    this.set(Pn.PRELOAD, t);
  }
  /**
   * Deprecated.  Whether we use interim tiles on error.
   * @return {boolean} Use interim tiles on error.
   * @observable
   * @api
   */
  getUseInterimTilesOnError() {
    return (
      /** @type {boolean} */
      this.get(Pn.USE_INTERIM_TILES_ON_ERROR)
    );
  }
  /**
   * Deprecated.  Set whether we use interim tiles on error.
   * @param {boolean} useInterimTilesOnError Use interim tiles on error.
   * @observable
   * @api
   */
  setUseInterimTilesOnError(t) {
    this.set(Pn.USE_INTERIM_TILES_ON_ERROR, t);
  }
  /**
   * Get data for a pixel location.  The return type depends on the source data.  For image tiles,
   * a four element RGBA array will be returned.  For data tiles, the array length will match the
   * number of bands in the dataset.  For requests outside the layer extent, `null` will be returned.
   * Data for a image tiles can only be retrieved if the source's `crossOrigin` property is set.
   *
   * ```js
   * // display layer data on every pointer move
   * map.on('pointermove', (event) => {
   *   console.log(layer.getData(event.pixel));
   * });
   * ```
   * @param {import("../pixel").Pixel} pixel Pixel.
   * @return {Uint8ClampedArray|Uint8Array|Float32Array|DataView|null} Pixel data.
   * @api
   * @override
   */
  getData(t) {
    return super.getData(t);
  }
}
class kn extends Gd {
  /**
   * @param {import("./BaseTile.js").Options<TileSourceType>} [options] Tile layer options.
   */
  constructor(t) {
    super(t);
  }
  /**
   * @override
   */
  createRenderer() {
    return new Nd(this, {
      cacheSize: this.getCacheSize()
    });
  }
}
class Tl {
  /**
   * Render a geometry with a custom renderer.
   *
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {Function} renderer Renderer.
   * @param {Function} hitDetectionRenderer Renderer.
   * @param {number} [index] Render order index.
   */
  drawCustom(t, e, i, s, r) {
  }
  /**
   * Render a geometry.
   *
   * @param {import("../geom/Geometry.js").default} geometry The geometry to render.
   */
  drawGeometry(t) {
  }
  /**
   * Set the rendering style.
   *
   * @param {import("../style/Style.js").default} style The rendering style.
   */
  setStyle(t) {
  }
  /**
   * @param {import("../geom/Circle.js").default} circleGeometry Circle geometry.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawCircle(t, e, i) {
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("../style/Style.js").default} style Style.
   * @param {number} [index] Render order index.
   */
  drawFeature(t, e, i) {
  }
  /**
   * @param {import("../geom/GeometryCollection.js").default} geometryCollectionGeometry Geometry collection.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawGeometryCollection(t, e, i) {
  }
  /**
   * @param {import("../geom/LineString.js").default|import("./Feature.js").default} lineStringGeometry Line string geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawLineString(t, e, i) {
  }
  /**
   * @param {import("../geom/MultiLineString.js").default|import("./Feature.js").default} multiLineStringGeometry MultiLineString geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawMultiLineString(t, e, i) {
  }
  /**
   * @param {import("../geom/MultiPoint.js").default|import("./Feature.js").default} multiPointGeometry MultiPoint geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawMultiPoint(t, e, i) {
  }
  /**
   * @param {import("../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawMultiPolygon(t, e, i) {
  }
  /**
   * @param {import("../geom/Point.js").default|import("./Feature.js").default} pointGeometry Point geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawPoint(t, e, i) {
  }
  /**
   * @param {import("../geom/Polygon.js").default|import("./Feature.js").default} polygonGeometry Polygon geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawPolygon(t, e, i) {
  }
  /**
   * @param {import("../geom/SimpleGeometry.js").default|import("./Feature.js").default} geometry Geometry.
   * @param {import("../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   */
  drawText(t, e, i) {
  }
  /**
   * @param {import("../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../style/Stroke.js").default} strokeStyle Stroke style.
   */
  setFillStrokeStyle(t, e) {
  }
  /**
   * @param {import("../style/Image.js").default} imageStyle Image style.
   * @param {import("../render/canvas.js").DeclutterImageWithText} [declutterImageWithText] Shared data for combined decluttering with a text style.
   */
  setImageStyle(t, e) {
  }
  /**
   * @param {import("../style/Text.js").default} textStyle Text style.
   * @param {import("../render/canvas.js").DeclutterImageWithText} [declutterImageWithText] Shared data for combined decluttering with an image style.
   */
  setTextStyle(t, e) {
  }
}
const P = {
  BEGIN_GEOMETRY: 0,
  BEGIN_PATH: 1,
  CIRCLE: 2,
  CLOSE_PATH: 3,
  CUSTOM: 4,
  DRAW_CHARS: 5,
  DRAW_IMAGE: 6,
  END_GEOMETRY: 7,
  FILL: 8,
  MOVE_TO_LINE_TO: 9,
  SET_FILL_STYLE: 10,
  SET_STROKE_STYLE: 11,
  STROKE: 12
}, On = [P.FILL], Le = [P.STROKE], Ke = [P.BEGIN_PATH], ta = [P.CLOSE_PATH];
class yn extends Tl {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, s) {
    super(), this.tolerance = t, this.maxExtent = e, this.pixelRatio = s, this.maxLineWidth = 0, this.resolution = i, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_ = null, this.bufferedMaxExtent_ = null, this.instructions = [], this.coordinates = [], this.tmpCoordinate_ = [], this.hitDetectionInstructions = [], this.state = /** @type {import("../canvas.js").FillStrokeState} */
    {};
  }
  /**
   * @protected
   * @param {Array<number>} dashArray Dash array.
   * @return {Array<number>} Dash array with pixel ratio applied
   */
  applyPixelRatio(t) {
    const e = this.pixelRatio;
    return e == 1 ? t : t.map(function(i) {
      return i * e;
    });
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} stride Stride.
   * @protected
   * @return {number} My end
   */
  appendFlatPointCoordinates(t, e) {
    const i = this.getBufferedMaxExtent(), s = this.tmpCoordinate_, r = this.coordinates;
    let o = r.length;
    for (let a = 0, l = t.length; a < l; a += e)
      s[0] = t[a], s[1] = t[a + 1], Ri(i, s) && (r[o++] = s[0], r[o++] = s[1]);
    return o;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} closed Last input coordinate equals first.
   * @param {boolean} skipFirst Skip first coordinate.
   * @protected
   * @return {number} My end.
   */
  appendFlatLineCoordinates(t, e, i, s, r, o) {
    const a = this.coordinates;
    let l = a.length;
    const c = this.getBufferedMaxExtent();
    o && (e += s);
    let h = t[e], u = t[e + 1];
    const d = this.tmpCoordinate_;
    let f = !0, g, m, _;
    for (g = e + s; g < i; g += s)
      d[0] = t[g], d[1] = t[g + 1], _ = er(c, d), _ !== m ? (f && (a[l++] = h, a[l++] = u, f = !1), a[l++] = d[0], a[l++] = d[1]) : _ === ut.INTERSECTING ? (a[l++] = d[0], a[l++] = d[1], f = !1) : f = !0, h = d[0], u = d[1], m = _;
    return (r && f || g === e + s) && (a[l++] = h, a[l++] = u), l;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @param {Array<number>} builderEnds Builder ends.
   * @return {number} Offset.
   */
  drawCustomCoordinates_(t, e, i, s, r) {
    for (let o = 0, a = i.length; o < a; ++o) {
      const l = i[o], c = this.appendFlatLineCoordinates(
        t,
        e,
        l,
        s,
        !1,
        !1
      );
      r.push(c), e = l;
    }
    return e;
  }
  /**
   * @param {import("../../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {Function} renderer Renderer.
   * @param {Function} hitDetectionRenderer Renderer.
   * @param {number} [index] Render order index.
   * @override
   */
  drawCustom(t, e, i, s, r) {
    this.beginGeometry(t, e, r);
    const o = t.getType(), a = t.getStride(), l = this.coordinates.length;
    let c, h, u, d, f;
    switch (o) {
      case "MultiPolygon":
        c = /** @type {import("../../geom/MultiPolygon.js").default} */
        t.getOrientedFlatCoordinates(), d = [];
        const g = (
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t.getEndss()
        );
        f = 0;
        for (let m = 0, _ = g.length; m < _; ++m) {
          const p = [];
          f = this.drawCustomCoordinates_(
            c,
            f,
            g[m],
            a,
            p
          ), d.push(p);
        }
        this.instructions.push([
          P.CUSTOM,
          l,
          d,
          t,
          i,
          So,
          r
        ]), this.hitDetectionInstructions.push([
          P.CUSTOM,
          l,
          d,
          t,
          s || i,
          So,
          r
        ]);
        break;
      case "Polygon":
      case "MultiLineString":
        u = [], c = o == "Polygon" ? (
          /** @type {import("../../geom/Polygon.js").default} */
          t.getOrientedFlatCoordinates()
        ) : t.getFlatCoordinates(), f = this.drawCustomCoordinates_(
          c,
          0,
          /** @type {import("../../geom/Polygon.js").default|import("../../geom/MultiLineString.js").default} */
          t.getEnds(),
          a,
          u
        ), this.instructions.push([
          P.CUSTOM,
          l,
          u,
          t,
          i,
          Vn,
          r
        ]), this.hitDetectionInstructions.push([
          P.CUSTOM,
          l,
          u,
          t,
          s || i,
          Vn,
          r
        ]);
        break;
      case "LineString":
      case "Circle":
        c = t.getFlatCoordinates(), h = this.appendFlatLineCoordinates(
          c,
          0,
          c.length,
          a,
          !1,
          !1
        ), this.instructions.push([
          P.CUSTOM,
          l,
          h,
          t,
          i,
          _i,
          r
        ]), this.hitDetectionInstructions.push([
          P.CUSTOM,
          l,
          h,
          t,
          s || i,
          _i,
          r
        ]);
        break;
      case "MultiPoint":
        c = t.getFlatCoordinates(), h = this.appendFlatPointCoordinates(c, a), h > l && (this.instructions.push([
          P.CUSTOM,
          l,
          h,
          t,
          i,
          _i,
          r
        ]), this.hitDetectionInstructions.push([
          P.CUSTOM,
          l,
          h,
          t,
          s || i,
          _i,
          r
        ]));
        break;
      case "Point":
        c = t.getFlatCoordinates(), this.coordinates.push(c[0], c[1]), h = this.coordinates.length, this.instructions.push([
          P.CUSTOM,
          l,
          h,
          t,
          i,
          void 0,
          r
        ]), this.hitDetectionInstructions.push([
          P.CUSTOM,
          l,
          h,
          t,
          s || i,
          void 0,
          r
        ]);
        break;
    }
    this.endGeometry(e);
  }
  /**
   * @protected
   * @param {import("../../geom/Geometry").default|import("../Feature.js").default} geometry The geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} index Render order index
   */
  beginGeometry(t, e, i) {
    this.beginGeometryInstruction1_ = [
      P.BEGIN_GEOMETRY,
      e,
      0,
      t,
      i
    ], this.instructions.push(this.beginGeometryInstruction1_), this.beginGeometryInstruction2_ = [
      P.BEGIN_GEOMETRY,
      e,
      0,
      t,
      i
    ], this.hitDetectionInstructions.push(this.beginGeometryInstruction2_);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   */
  finish() {
    return {
      instructions: this.instructions,
      hitDetectionInstructions: this.hitDetectionInstructions,
      coordinates: this.coordinates
    };
  }
  /**
   * Reverse the hit detection instructions.
   */
  reverseHitDetectionInstructions() {
    const t = this.hitDetectionInstructions;
    t.reverse();
    let e;
    const i = t.length;
    let s, r, o = -1;
    for (e = 0; e < i; ++e)
      s = t[e], r = /** @type {import("./Instruction.js").default} */
      s[0], r == P.END_GEOMETRY ? o = e : r == P.BEGIN_GEOMETRY && (s[2] = e, Vl(this.hitDetectionInstructions, o, e), o = -1);
  }
  /**
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import('../canvas.js').FillStrokeState} [state] State.
   * @return {import('../canvas.js').FillStrokeState} State.
   */
  fillStyleToState(t, e = (
    /** @type {import('../canvas.js').FillStrokeState} */
    {}
  )) {
    if (t) {
      const i = t.getColor();
      e.fillPatternScale = i && typeof i == "object" && "src" in i ? this.pixelRatio : 1, e.fillStyle = ne(
        i || Tt
      );
    } else
      e.fillStyle = void 0;
    return e;
  }
  /**
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {import("../canvas.js").FillStrokeState} State.
   */
  strokeStyleToState(t, e = (
    /** @type {import('../canvas.js').FillStrokeState} */
    {}
  )) {
    if (t) {
      const i = t.getColor();
      e.strokeStyle = ne(
        i || on
      );
      const s = t.getLineCap();
      e.lineCap = s !== void 0 ? s : Ii;
      const r = t.getLineDash();
      e.lineDash = r ? r.slice() : _e;
      const o = t.getLineDashOffset();
      e.lineDashOffset = o || me;
      const a = t.getLineJoin();
      e.lineJoin = a !== void 0 ? a : vi;
      const l = t.getWidth();
      e.lineWidth = l !== void 0 ? l : ln;
      const c = t.getMiterLimit();
      e.miterLimit = c !== void 0 ? c : rn, e.lineWidth > this.maxLineWidth && (this.maxLineWidth = e.lineWidth, this.bufferedMaxExtent_ = null);
    } else
      e.strokeStyle = void 0, e.lineCap = void 0, e.lineDash = null, e.lineDashOffset = void 0, e.lineJoin = void 0, e.lineWidth = void 0, e.miterLimit = void 0;
    return e;
  }
  /**
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @override
   */
  setFillStrokeStyle(t, e) {
    const i = this.state;
    this.fillStyleToState(t, i), this.strokeStyleToState(e, i);
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {Array<*>} Fill instruction.
   */
  createFill(t) {
    const e = t.fillStyle, i = [P.SET_FILL_STYLE, e];
    return typeof e != "string" && i.push(t.fillPatternScale), i;
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   */
  applyStroke(t) {
    this.instructions.push(this.createStroke(t));
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @return {Array<*>} Stroke instruction.
   */
  createStroke(t) {
    return [
      P.SET_STROKE_STYLE,
      t.strokeStyle,
      t.lineWidth * this.pixelRatio,
      t.lineCap,
      t.lineJoin,
      t.miterLimit,
      t.lineDash ? this.applyPixelRatio(t.lineDash) : null,
      t.lineDashOffset * this.pixelRatio
    ];
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState):Array<*>} createFill Create fill.
   */
  updateFillStyle(t, e) {
    const i = t.fillStyle;
    (typeof i != "string" || t.currentFillStyle != i) && (i !== void 0 && this.instructions.push(e.call(this, t)), t.currentFillStyle = i);
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @param {function(this:CanvasBuilder, import("../canvas.js").FillStrokeState): void} applyStroke Apply stroke.
   */
  updateStrokeStyle(t, e) {
    const i = t.strokeStyle, s = t.lineCap, r = t.lineDash, o = t.lineDashOffset, a = t.lineJoin, l = t.lineWidth, c = t.miterLimit;
    (t.currentStrokeStyle != i || t.currentLineCap != s || r != t.currentLineDash && !Pe(t.currentLineDash, r) || t.currentLineDashOffset != o || t.currentLineJoin != a || t.currentLineWidth != l || t.currentMiterLimit != c) && (i !== void 0 && e.call(this, t), t.currentStrokeStyle = i, t.currentLineCap = s, t.currentLineDash = r, t.currentLineDashOffset = o, t.currentLineJoin = a, t.currentLineWidth = l, t.currentMiterLimit = c);
  }
  /**
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   */
  endGeometry(t) {
    this.beginGeometryInstruction1_[2] = this.instructions.length, this.beginGeometryInstruction1_ = null, this.beginGeometryInstruction2_[2] = this.hitDetectionInstructions.length, this.beginGeometryInstruction2_ = null;
    const e = [P.END_GEOMETRY, t];
    this.instructions.push(e), this.hitDetectionInstructions.push(e);
  }
  /**
   * Get the buffered rendering extent.  Rendering will be clipped to the extent
   * provided to the constructor.  To account for symbolizers that may intersect
   * this extent, we calculate a buffered extent (e.g. based on stroke width).
   * @return {import("../../extent.js").Extent} The buffered rendering extent.
   * @protected
   */
  getBufferedMaxExtent() {
    if (!this.bufferedMaxExtent_ && (this.bufferedMaxExtent_ = ya(this.maxExtent), this.maxLineWidth > 0)) {
      const t = this.resolution * (this.maxLineWidth + 1) / 2;
      mr(this.bufferedMaxExtent_, t, this.bufferedMaxExtent_);
    }
    return this.bufferedMaxExtent_;
  }
}
class zd extends yn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, s) {
    super(t, e, i, s), this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.anchorX_ = void 0, this.anchorY_ = void 0, this.height_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.scale_ = void 0, this.width_ = void 0, this.declutterMode_ = void 0, this.declutterImageWithText_ = void 0;
  }
  /**
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} pointGeometry Point geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawPoint(t, e, i) {
    if (!this.image_ || this.maxExtent && !Ri(this.maxExtent, t.getFlatCoordinates()))
      return;
    this.beginGeometry(t, e, i);
    const s = t.getFlatCoordinates(), r = t.getStride(), o = this.coordinates.length, a = this.appendFlatPointCoordinates(s, r);
    this.instructions.push([
      P.DRAW_IMAGE,
      o,
      a,
      this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.hitDetectionInstructions.push([
      P.DRAW_IMAGE,
      o,
      a,
      this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_,
      this.anchorY_,
      this.height_,
      1,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} multiPointGeometry MultiPoint geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawMultiPoint(t, e, i) {
    if (!this.image_)
      return;
    this.beginGeometry(t, e, i);
    const s = t.getFlatCoordinates(), r = [];
    for (let l = 0, c = s.length; l < c; l += t.getStride())
      (!this.maxExtent || Ri(this.maxExtent, s.slice(l, l + 2))) && r.push(
        s[l],
        s[l + 1]
      );
    const o = this.coordinates.length, a = this.appendFlatPointCoordinates(r, 2);
    this.instructions.push([
      P.DRAW_IMAGE,
      o,
      a,
      this.image_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_ * this.imagePixelRatio_,
      this.anchorY_ * this.imagePixelRatio_,
      Math.ceil(this.height_ * this.imagePixelRatio_),
      this.opacity_,
      this.originX_ * this.imagePixelRatio_,
      this.originY_ * this.imagePixelRatio_,
      this.rotateWithView_,
      this.rotation_,
      [
        this.scale_[0] * this.pixelRatio / this.imagePixelRatio_,
        this.scale_[1] * this.pixelRatio / this.imagePixelRatio_
      ],
      Math.ceil(this.width_ * this.imagePixelRatio_),
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.hitDetectionInstructions.push([
      P.DRAW_IMAGE,
      o,
      a,
      this.hitDetectionImage_,
      // Remaining arguments to DRAW_IMAGE are in alphabetical order
      this.anchorX_,
      this.anchorY_,
      this.height_,
      1,
      this.originX_,
      this.originY_,
      this.rotateWithView_,
      this.rotation_,
      this.scale_,
      this.width_,
      this.declutterMode_,
      this.declutterImageWithText_
    ]), this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    return this.reverseHitDetectionInstructions(), this.anchorX_ = void 0, this.anchorY_ = void 0, this.hitDetectionImage_ = null, this.image_ = null, this.imagePixelRatio_ = void 0, this.height_ = void 0, this.scale_ = void 0, this.opacity_ = void 0, this.originX_ = void 0, this.originY_ = void 0, this.rotateWithView_ = void 0, this.rotation_ = void 0, this.width_ = void 0, super.finish();
  }
  /**
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   * @param {Object} [sharedData] Shared data.
   * @override
   */
  setImageStyle(t, e) {
    const i = t.getAnchor(), s = t.getSize(), r = t.getOrigin();
    this.imagePixelRatio_ = t.getPixelRatio(this.pixelRatio), this.anchorX_ = i[0], this.anchorY_ = i[1], this.hitDetectionImage_ = t.getHitDetectionImage(), this.image_ = t.getImage(this.pixelRatio), this.height_ = s[1], this.opacity_ = t.getOpacity(), this.originX_ = r[0], this.originY_ = r[1], this.rotateWithView_ = t.getRotateWithView(), this.rotation_ = t.getRotation(), this.scale_ = t.getScaleArray(), this.width_ = s[0], this.declutterMode_ = t.getDeclutterMode(), this.declutterImageWithText_ = e;
  }
}
class Wd extends yn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, s) {
    super(t, e, i, s);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   * @return {number} end.
   */
  drawFlatCoordinates_(t, e, i, s) {
    const r = this.coordinates.length, o = this.appendFlatLineCoordinates(
      t,
      e,
      i,
      s,
      !1,
      !1
    ), a = [
      P.MOVE_TO_LINE_TO,
      r,
      o
    ];
    return this.instructions.push(a), this.hitDetectionInstructions.push(a), i;
  }
  /**
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} lineStringGeometry Line string geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawLineString(t, e, i) {
    const s = this.state, r = s.strokeStyle, o = s.lineWidth;
    if (r === void 0 || o === void 0)
      return;
    this.updateStrokeStyle(s, this.applyStroke), this.beginGeometry(t, e, i), this.hitDetectionInstructions.push(
      [
        P.SET_STROKE_STYLE,
        s.strokeStyle,
        s.lineWidth,
        s.lineCap,
        s.lineJoin,
        s.miterLimit,
        _e,
        me
      ],
      Ke
    );
    const a = t.getFlatCoordinates(), l = t.getStride();
    this.drawFlatCoordinates_(
      a,
      0,
      a.length,
      l
    ), this.hitDetectionInstructions.push(Le), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} multiLineStringGeometry MultiLineString geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawMultiLineString(t, e, i) {
    const s = this.state, r = s.strokeStyle, o = s.lineWidth;
    if (r === void 0 || o === void 0)
      return;
    this.updateStrokeStyle(s, this.applyStroke), this.beginGeometry(t, e, i), this.hitDetectionInstructions.push(
      [
        P.SET_STROKE_STYLE,
        s.strokeStyle,
        s.lineWidth,
        s.lineCap,
        s.lineJoin,
        s.miterLimit,
        _e,
        me
      ],
      Ke
    );
    const a = t.getEnds(), l = t.getFlatCoordinates(), c = t.getStride();
    let h = 0;
    for (let u = 0, d = a.length; u < d; ++u)
      h = this.drawFlatCoordinates_(
        l,
        h,
        /** @type {number} */
        a[u],
        c
      );
    this.hitDetectionInstructions.push(Le), this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    const t = this.state;
    return t.lastStroke != null && t.lastStroke != this.coordinates.length && this.instructions.push(Le), this.reverseHitDetectionInstructions(), this.state = null, super.finish();
  }
  /**
   * @param {import("../canvas.js").FillStrokeState} state State.
   * @override
   */
  applyStroke(t) {
    t.lastStroke != null && t.lastStroke != this.coordinates.length && (this.instructions.push(Le), t.lastStroke = this.coordinates.length), t.lastStroke = 0, super.applyStroke(t), this.instructions.push(Ke);
  }
}
class ea extends yn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, s) {
    super(t, e, i, s);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  drawFlatCoordinatess_(t, e, i, s) {
    const r = this.state, o = r.fillStyle !== void 0, a = r.strokeStyle !== void 0, l = i.length;
    this.instructions.push(Ke), this.hitDetectionInstructions.push(Ke);
    for (let c = 0; c < l; ++c) {
      const h = i[c], u = this.coordinates.length, d = this.appendFlatLineCoordinates(
        t,
        e,
        h,
        s,
        !0,
        !a
      ), f = [
        P.MOVE_TO_LINE_TO,
        u,
        d
      ];
      this.instructions.push(f), this.hitDetectionInstructions.push(f), a && (this.instructions.push(ta), this.hitDetectionInstructions.push(ta)), e = h;
    }
    return o && (this.instructions.push(On), this.hitDetectionInstructions.push(On)), a && (this.instructions.push(Le), this.hitDetectionInstructions.push(Le)), e;
  }
  /**
   * @param {import("../../geom/Circle.js").default} circleGeometry Circle geometry.
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawCircle(t, e, i) {
    const s = this.state, r = s.fillStyle, o = s.strokeStyle;
    if (r === void 0 && o === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e, i), s.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      P.SET_FILL_STYLE,
      Tt
    ]), s.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      P.SET_STROKE_STYLE,
      s.strokeStyle,
      s.lineWidth,
      s.lineCap,
      s.lineJoin,
      s.miterLimit,
      _e,
      me
    ]);
    const a = t.getFlatCoordinates(), l = t.getStride(), c = this.coordinates.length;
    this.appendFlatLineCoordinates(
      a,
      0,
      a.length,
      l,
      !1,
      !1
    );
    const h = [P.CIRCLE, c];
    this.instructions.push(Ke, h), this.hitDetectionInstructions.push(Ke, h), s.fillStyle !== void 0 && (this.instructions.push(On), this.hitDetectionInstructions.push(On)), s.strokeStyle !== void 0 && (this.instructions.push(Le), this.hitDetectionInstructions.push(Le)), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} polygonGeometry Polygon geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawPolygon(t, e, i) {
    const s = this.state, r = s.fillStyle, o = s.strokeStyle;
    if (r === void 0 && o === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e, i), s.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      P.SET_FILL_STYLE,
      Tt
    ]), s.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      P.SET_STROKE_STYLE,
      s.strokeStyle,
      s.lineWidth,
      s.lineCap,
      s.lineJoin,
      s.miterLimit,
      _e,
      me
    ]);
    const a = t.getEnds(), l = t.getOrientedFlatCoordinates(), c = t.getStride();
    this.drawFlatCoordinatess_(
      l,
      0,
      /** @type {Array<number>} */
      a,
      c
    ), this.endGeometry(e);
  }
  /**
   * @param {import("../../geom/MultiPolygon.js").default} multiPolygonGeometry MultiPolygon geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawMultiPolygon(t, e, i) {
    const s = this.state, r = s.fillStyle, o = s.strokeStyle;
    if (r === void 0 && o === void 0)
      return;
    this.setFillStrokeStyles_(), this.beginGeometry(t, e, i), s.fillStyle !== void 0 && this.hitDetectionInstructions.push([
      P.SET_FILL_STYLE,
      Tt
    ]), s.strokeStyle !== void 0 && this.hitDetectionInstructions.push([
      P.SET_STROKE_STYLE,
      s.strokeStyle,
      s.lineWidth,
      s.lineCap,
      s.lineJoin,
      s.miterLimit,
      _e,
      me
    ]);
    const a = t.getEndss(), l = t.getOrientedFlatCoordinates(), c = t.getStride();
    let h = 0;
    for (let u = 0, d = a.length; u < d; ++u)
      h = this.drawFlatCoordinatess_(
        l,
        h,
        a[u],
        c
      );
    this.endGeometry(e);
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    this.reverseHitDetectionInstructions(), this.state = null;
    const t = this.tolerance;
    if (t !== 0) {
      const e = this.coordinates;
      for (let i = 0, s = e.length; i < s; ++i)
        e[i] = ze(e[i], t);
    }
    return super.finish();
  }
  /**
   * @private
   */
  setFillStrokeStyles_() {
    const t = this.state;
    t.fillStyle !== void 0 && this.updateFillStyle(t, this.createFill), t.strokeStyle !== void 0 && this.updateStrokeStyle(t, this.applyStroke);
  }
}
function Xd(n, t, e, i, s) {
  const r = [];
  let o = e, a = 0, l = t.slice(e, 2);
  for (; a < n && o + s < i; ) {
    const [c, h] = l.slice(-2), u = t[o + s], d = t[o + s + 1], f = Math.sqrt(
      (u - c) * (u - c) + (d - h) * (d - h)
    );
    if (a += f, a >= n) {
      const g = (n - a + f) / f, m = Nt(c, u, g), _ = Nt(h, d, g);
      l.push(m, _), r.push(l), l = [m, _], a == n && (o += s), a = 0;
    } else if (a < n)
      l.push(
        t[o + s],
        t[o + s + 1]
      ), o += s;
    else {
      const g = f - a, m = Nt(c, u, g / f), _ = Nt(h, d, g / f);
      l.push(m, _), r.push(l), l = [m, _], a = 0, o += s;
    }
  }
  return a > 0 && r.push(l), r;
}
function Yd(n, t, e, i, s) {
  let r = e, o = e, a = 0, l = 0, c = e, h, u, d, f, g, m, _, p, E, w;
  for (u = e; u < i; u += s) {
    const y = t[u], x = t[u + 1];
    g !== void 0 && (E = y - g, w = x - m, f = Math.sqrt(E * E + w * w), _ !== void 0 && (l += d, h = Math.acos((_ * E + p * w) / (d * f)), h > n && (l > a && (a = l, r = c, o = u), l = 0, c = u - s)), d = f, _ = E, p = w), g = y, m = x;
  }
  return l += f, l > a ? [c, u] : [r, o];
}
const Jn = {
  left: 0,
  center: 0.5,
  right: 1,
  top: 0,
  middle: 0.5,
  hanging: 0.2,
  alphabetic: 0.8,
  ideographic: 0.8,
  bottom: 1
};
class Kd extends yn {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Maximum extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, s) {
    super(t, e, i, s), this.labels_ = null, this.text_ = "", this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = void 0, this.textKeepUpright_ = void 0, this.textRotation_ = 0, this.textFillState_ = null, this.fillStates = {}, this.fillStates[Tt] = { fillStyle: Tt }, this.textStrokeState_ = null, this.strokeStates = {}, this.textState_ = /** @type {import("../canvas.js").TextState} */
    {}, this.textStates = {}, this.textKey_ = "", this.fillKey_ = "", this.strokeKey_ = "", this.declutterMode_ = void 0, this.declutterImageWithText_ = void 0;
  }
  /**
   * @return {import("../canvas.js").SerializableInstructions} the serializable instructions.
   * @override
   */
  finish() {
    const t = super.finish();
    return t.textStates = this.textStates, t.fillStates = this.fillStates, t.strokeStates = this.strokeStates, t;
  }
  /**
   * @param {import("../../geom/SimpleGeometry.js").default|import("../Feature.js").default} geometry Geometry.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} [index] Render order index.
   * @override
   */
  drawText(t, e, i) {
    const s = this.textFillState_, r = this.textStrokeState_, o = this.textState_;
    if (this.text_ === "" || !o || !s && !r)
      return;
    const a = this.coordinates;
    let l = a.length;
    const c = t.getType();
    let h = null, u = t.getStride();
    if (o.placement === "line" && (c == "LineString" || c == "MultiLineString" || c == "Polygon" || c == "MultiPolygon")) {
      if (!It(this.maxExtent, t.getExtent()))
        return;
      let d;
      if (h = t.getFlatCoordinates(), c == "LineString")
        d = [h.length];
      else if (c == "MultiLineString")
        d = /** @type {import("../../geom/MultiLineString.js").default} */
        t.getEnds();
      else if (c == "Polygon")
        d = /** @type {import("../../geom/Polygon.js").default} */
        t.getEnds().slice(0, 1);
      else if (c == "MultiPolygon") {
        const _ = (
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t.getEndss()
        );
        d = [];
        for (let p = 0, E = _.length; p < E; ++p)
          d.push(_[p][0]);
      }
      this.beginGeometry(t, e, i);
      const f = o.repeat, g = f ? void 0 : o.textAlign;
      let m = 0;
      for (let _ = 0, p = d.length; _ < p; ++_) {
        let E;
        f ? E = Xd(
          f * this.resolution,
          h,
          m,
          d[_],
          u
        ) : E = [h.slice(m, d[_])];
        for (let w = 0, y = E.length; w < y; ++w) {
          const x = E[w];
          let R = 0, T = x.length;
          if (g == null) {
            const v = Yd(
              o.maxAngle,
              x,
              0,
              x.length,
              2
            );
            R = v[0], T = v[1];
          }
          for (let v = R; v < T; v += u)
            a.push(x[v], x[v + 1]);
          const S = a.length;
          m = d[_], this.drawChars_(l, S), l = S;
        }
      }
      this.endGeometry(e);
    } else {
      let d = o.overflow ? null : [];
      switch (c) {
        case "Point":
        case "MultiPoint":
          h = /** @type {import("../../geom/MultiPoint.js").default} */
          t.getFlatCoordinates();
          break;
        case "LineString":
          h = /** @type {import("../../geom/LineString.js").default} */
          t.getFlatMidpoint();
          break;
        case "Circle":
          h = /** @type {import("../../geom/Circle.js").default} */
          t.getCenter();
          break;
        case "MultiLineString":
          h = /** @type {import("../../geom/MultiLineString.js").default} */
          t.getFlatMidpoints(), u = 2;
          break;
        case "Polygon":
          h = /** @type {import("../../geom/Polygon.js").default} */
          t.getFlatInteriorPoint(), o.overflow || d.push(h[2] / this.resolution), u = 3;
          break;
        case "MultiPolygon":
          const y = (
            /** @type {import("../../geom/MultiPolygon.js").default} */
            t.getFlatInteriorPoints()
          );
          h = [];
          for (let x = 0, R = y.length; x < R; x += 3)
            o.overflow || d.push(y[x + 2] / this.resolution), h.push(y[x], y[x + 1]);
          if (h.length === 0)
            return;
          u = 2;
          break;
      }
      const f = this.appendFlatPointCoordinates(h, u);
      if (f === l)
        return;
      if (d && (f - l) / 2 !== h.length / u) {
        let y = l / 2;
        d = d.filter((x, R) => {
          const T = a[(y + R) * 2] === h[R * u] && a[(y + R) * 2 + 1] === h[R * u + 1];
          return T || --y, T;
        });
      }
      this.saveTextStates_();
      const g = o.backgroundFill ? this.createFill(this.fillStyleToState(o.backgroundFill)) : null, m = o.backgroundStroke ? this.createStroke(this.strokeStyleToState(o.backgroundStroke)) : null;
      this.beginGeometry(t, e, i);
      let _ = o.padding;
      if (_ != Ye && (o.scale[0] < 0 || o.scale[1] < 0)) {
        let y = o.padding[0], x = o.padding[1], R = o.padding[2], T = o.padding[3];
        o.scale[0] < 0 && (x = -x, T = -T), o.scale[1] < 0 && (y = -y, R = -R), _ = [y, x, R, T];
      }
      const p = this.pixelRatio;
      this.instructions.push([
        P.DRAW_IMAGE,
        l,
        f,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [1, 1],
        NaN,
        this.declutterMode_,
        this.declutterImageWithText_,
        _ == Ye ? Ye : _.map(function(y) {
          return y * p;
        }),
        g,
        m,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        d
      ]);
      const E = 1 / p, w = g ? g.slice(0) : null;
      w && (w[1] = Tt), this.hitDetectionInstructions.push([
        P.DRAW_IMAGE,
        l,
        f,
        null,
        NaN,
        NaN,
        NaN,
        1,
        0,
        0,
        this.textRotateWithView_,
        this.textRotation_,
        [E, E],
        NaN,
        this.declutterMode_,
        this.declutterImageWithText_,
        _,
        w,
        m,
        this.text_,
        this.textKey_,
        this.strokeKey_,
        this.fillKey_ ? Tt : this.fillKey_,
        this.textOffsetX_,
        this.textOffsetY_,
        d
      ]), this.endGeometry(e);
    }
  }
  /**
   * @private
   */
  saveTextStates_() {
    const t = this.textStrokeState_, e = this.textState_, i = this.textFillState_, s = this.strokeKey_;
    t && (s in this.strokeStates || (this.strokeStates[s] = {
      strokeStyle: t.strokeStyle,
      lineCap: t.lineCap,
      lineDashOffset: t.lineDashOffset,
      lineWidth: t.lineWidth,
      lineJoin: t.lineJoin,
      miterLimit: t.miterLimit,
      lineDash: t.lineDash
    }));
    const r = this.textKey_;
    r in this.textStates || (this.textStates[r] = {
      font: e.font,
      textAlign: e.textAlign || an,
      justify: e.justify,
      textBaseline: e.textBaseline || Un,
      scale: e.scale
    });
    const o = this.fillKey_;
    i && (o in this.fillStates || (this.fillStates[o] = {
      fillStyle: i.fillStyle
    }));
  }
  /**
   * @private
   * @param {number} begin Begin.
   * @param {number} end End.
   */
  drawChars_(t, e) {
    const i = this.textStrokeState_, s = this.textState_, r = this.strokeKey_, o = this.textKey_, a = this.fillKey_;
    this.saveTextStates_();
    const l = this.pixelRatio, c = Jn[s.textBaseline], h = this.textOffsetY_ * l, u = this.text_, d = i ? i.lineWidth * Math.abs(s.scale[0]) / 2 : 0;
    this.instructions.push([
      P.DRAW_CHARS,
      t,
      e,
      c,
      s.overflow,
      a,
      s.maxAngle,
      l,
      h,
      r,
      d * l,
      u,
      o,
      1,
      this.declutterMode_,
      this.textKeepUpright_
    ]), this.hitDetectionInstructions.push([
      P.DRAW_CHARS,
      t,
      e,
      c,
      s.overflow,
      a && Tt,
      s.maxAngle,
      l,
      h,
      r,
      d * l,
      u,
      o,
      1 / l,
      this.declutterMode_,
      this.textKeepUpright_
    ]);
  }
  /**
   * @param {import("../../style/Text.js").default} textStyle Text style.
   * @param {Object} [sharedData] Shared data.
   * @override
   */
  setTextStyle(t, e) {
    let i, s, r;
    if (!t)
      this.text_ = "";
    else {
      const o = t.getFill();
      o ? (s = this.textFillState_, s || (s = /** @type {import("../canvas.js").FillState} */
      {}, this.textFillState_ = s), s.fillStyle = ne(
        o.getColor() || Tt
      )) : (s = null, this.textFillState_ = s);
      const a = t.getStroke();
      if (!a)
        r = null, this.textStrokeState_ = r;
      else {
        r = this.textStrokeState_, r || (r = /** @type {import("../canvas.js").StrokeState} */
        {}, this.textStrokeState_ = r);
        const m = a.getLineDash(), _ = a.getLineDashOffset(), p = a.getWidth(), E = a.getMiterLimit();
        r.lineCap = a.getLineCap() || Ii, r.lineDash = m ? m.slice() : _e, r.lineDashOffset = _ === void 0 ? me : _, r.lineJoin = a.getLineJoin() || vi, r.lineWidth = p === void 0 ? ln : p, r.miterLimit = E === void 0 ? rn : E, r.strokeStyle = ne(
          a.getColor() || on
        );
      }
      i = this.textState_;
      const l = t.getFont() || cl;
      Vu(l);
      const c = t.getScaleArray();
      i.overflow = t.getOverflow(), i.font = l, i.maxAngle = t.getMaxAngle(), i.placement = t.getPlacement(), i.textAlign = t.getTextAlign(), i.repeat = t.getRepeat(), i.justify = t.getJustify(), i.textBaseline = t.getTextBaseline() || Un, i.backgroundFill = t.getBackgroundFill(), i.backgroundStroke = t.getBackgroundStroke(), i.padding = t.getPadding() || Ye, i.scale = c === void 0 ? [1, 1] : c;
      const h = t.getOffsetX(), u = t.getOffsetY(), d = t.getRotateWithView(), f = t.getKeepUpright(), g = t.getRotation();
      this.text_ = t.getText() || "", this.textOffsetX_ = h === void 0 ? 0 : h, this.textOffsetY_ = u === void 0 ? 0 : u, this.textRotateWithView_ = d === void 0 ? !1 : d, this.textKeepUpright_ = f === void 0 ? !0 : f, this.textRotation_ = g === void 0 ? 0 : g, this.strokeKey_ = r ? (typeof r.strokeStyle == "string" ? r.strokeStyle : B(r.strokeStyle)) + r.lineCap + r.lineDashOffset + "|" + r.lineWidth + r.lineJoin + r.miterLimit + "[" + r.lineDash.join() + "]" : "", this.textKey_ = i.font + i.scale + (i.textAlign || "?") + (i.repeat || "?") + (i.justify || "?") + (i.textBaseline || "?"), this.fillKey_ = s && s.fillStyle ? typeof s.fillStyle == "string" ? s.fillStyle : "|" + B(s.fillStyle) : "";
    }
    this.declutterMode_ = t.getDeclutterMode(), this.declutterImageWithText_ = e;
  }
}
const Bd = {
  Circle: ea,
  Default: yn,
  Image: zd,
  LineString: Wd,
  Polygon: ea,
  Text: Kd
};
class Vd {
  /**
   * @param {number} tolerance Tolerance.
   * @param {import("../../extent.js").Extent} maxExtent Max extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   */
  constructor(t, e, i, s) {
    this.tolerance_ = t, this.maxExtent_ = e, this.pixelRatio_ = s, this.resolution_ = i, this.buildersByZIndex_ = {};
  }
  /**
   * @return {!Object<string, !Object<import("../canvas.js").BuilderType, import("./Builder.js").SerializableInstructions>>} The serializable instructions
   */
  finish() {
    const t = {};
    for (const e in this.buildersByZIndex_) {
      t[e] = t[e] || {};
      const i = this.buildersByZIndex_[e];
      for (const s in i) {
        const r = i[s].finish();
        t[e][s] = r;
      }
    }
    return t;
  }
  /**
   * @param {number|undefined} zIndex Z index.
   * @param {import("../canvas.js").BuilderType} builderType Replay type.
   * @return {import("../VectorContext.js").default} Replay.
   */
  getBuilder(t, e) {
    const i = t !== void 0 ? t.toString() : "0";
    let s = this.buildersByZIndex_[i];
    s === void 0 && (s = {}, this.buildersByZIndex_[i] = s);
    let r = s[e];
    if (r === void 0) {
      const o = Bd[e];
      r = new o(
        this.tolerance_,
        this.maxExtent_,
        this.resolution_,
        this.pixelRatio_
      ), s[e] = r;
    }
    return r;
  }
}
function Zd(n, t, e, i) {
  let s = n[t], r = n[t + 1], o = 0;
  for (let a = t + i; a < e; a += i) {
    const l = n[a], c = n[a + 1];
    o += Math.sqrt((l - s) * (l - s) + (c - r) * (c - r)), s = l, r = c;
  }
  return o;
}
function Ud(n, t, e, i, s, r, o, a, l, c, h, u, d = !0) {
  let f = n[t], g = n[t + 1], m = 0, _ = 0, p = 0, E = 0;
  function w() {
    m = f, _ = g, t += i, f = n[t], g = n[t + 1], E += p, p = Math.sqrt((f - m) * (f - m) + (g - _) * (g - _));
  }
  do
    w();
  while (t < e - i && E + p < r);
  let y = p === 0 ? 0 : (r - E) / p;
  const x = Nt(m, f, y), R = Nt(_, g, y), T = t - i, S = E, v = r + a * l(c, s, h);
  for (; t < e - i && E + p < v; )
    w();
  y = p === 0 ? 0 : (v - E) / p;
  const L = Nt(m, f, y), k = Nt(_, g, y);
  let b = !1;
  if (d)
    if (u) {
      const G = [x, R, L, k];
      za(G, 0, 4, 2, u, G, G), b = G[0] > G[2];
    } else
      b = x > L;
  const A = Math.PI, M = [], Y = T + i === t;
  t = T, p = 0, E = S, f = n[t], g = n[t + 1];
  let F;
  if (Y) {
    w(), F = Math.atan2(g - _, f - m), b && (F += F > 0 ? -A : A);
    const G = (L + x) / 2, D = (k + R) / 2;
    return M[0] = [G, D, (v - r) / 2, F, s], M;
  }
  s = s.replace(/\n/g, " ");
  for (let G = 0, D = s.length; G < D; ) {
    w();
    let K = Math.atan2(g - _, f - m);
    if (b && (K += K > 0 ? -A : A), F !== void 0) {
      let st = K - F;
      if (st += st > A ? -2 * A : st < -A ? 2 * A : 0, Math.abs(st) > o)
        return null;
    }
    F = K;
    const V = G;
    let Q = 0;
    for (; G < D; ++G) {
      const st = b ? D - G - 1 : G, Mt = a * l(c, s[st], h);
      if (t + i < e && E + p < r + Q + Mt / 2)
        break;
      Q += Mt;
    }
    if (G === V)
      continue;
    const I = b ? s.substring(D - V, D - G) : s.substring(V, G);
    y = p === 0 ? 0 : (r + Q / 2 - E) / p;
    const _t = Nt(m, f, y), xt = Nt(_, g, y);
    M.push([_t, xt, Q / 2, K, I]), r += Q;
  }
  return M;
}
const ai = Yt(), we = [], le = [], he = [], Ce = [];
function ia(n) {
  return n[3].declutterBox;
}
const na = new RegExp(
  /* eslint-disable prettier/prettier */
  "[֑-ࣿיִ-﷿ﹰ-ﻼࠀ-࿿-]"
  /* eslint-enable prettier/prettier */
);
function js(n, t) {
  return t === "start" ? t = na.test(n) ? "right" : "left" : t === "end" && (t = na.test(n) ? "left" : "right"), Jn[t];
}
function jd(n, t, e) {
  return e > 0 && n.push(`
`, ""), n.push(t, ""), n;
}
function Hd(n, t, e) {
  return e % 2 === 0 && (n += t), n;
}
class $d {
  /**
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The replay can have overlapping geometries.
   * @param {import("../canvas.js").SerializableInstructions} instructions The serializable instructions.
   * @param {boolean} [deferredRendering] Enable deferred rendering.
   */
  constructor(t, e, i, s, r) {
    this.overlaps = i, this.pixelRatio = e, this.resolution = t, this.alignAndScaleFill_, this.instructions = s.instructions, this.coordinates = s.coordinates, this.coordinateCache_ = {}, this.renderedTransform_ = jt(), this.hitDetectionInstructions = s.hitDetectionInstructions, this.pixelCoordinates_ = null, this.viewRotation_ = 0, this.fillStates = s.fillStates || {}, this.strokeStates = s.strokeStates || {}, this.textStates = s.textStates || {}, this.widths_ = {}, this.labels_ = {}, this.zIndexContext_ = r ? new Rl() : null;
  }
  /**
   * @return {ZIndexContext} ZIndex context.
   */
  getZIndexContext() {
    return this.zIndexContext_;
  }
  /**
   * @param {string|Array<string>} text Text.
   * @param {string} textKey Text style key.
   * @param {string} fillKey Fill style key.
   * @param {string} strokeKey Stroke style key.
   * @return {import("../canvas.js").Label} Label.
   */
  createLabel(t, e, i, s) {
    const r = t + e + i + s;
    if (this.labels_[r])
      return this.labels_[r];
    const o = s ? this.strokeStates[s] : null, a = i ? this.fillStates[i] : null, l = this.textStates[e], c = this.pixelRatio, h = [
      l.scale[0] * c,
      l.scale[1] * c
    ], u = l.justify ? Jn[l.justify] : js(
      Array.isArray(t) ? t[0] : t,
      l.textAlign || an
    ), d = s && o.lineWidth ? o.lineWidth : 0, f = Array.isArray(t) ? t : String(t).split(`
`).reduce(jd, []), { width: g, height: m, widths: _, heights: p, lineWidths: E } = Uu(
      l,
      f
    ), w = g + d, y = [], x = (w + 2) * h[0], R = (m + d) * h[1], T = {
      width: x < 0 ? Math.floor(x) : Math.ceil(x),
      height: R < 0 ? Math.floor(R) : Math.ceil(R),
      contextInstructions: y
    };
    (h[0] != 1 || h[1] != 1) && y.push("scale", h), s && (y.push("strokeStyle", o.strokeStyle), y.push("lineWidth", d), y.push("lineCap", o.lineCap), y.push("lineJoin", o.lineJoin), y.push("miterLimit", o.miterLimit), y.push("setLineDash", [o.lineDash]), y.push("lineDashOffset", o.lineDashOffset)), i && y.push("fillStyle", a.fillStyle), y.push("textBaseline", "middle"), y.push("textAlign", "center");
    const S = 0.5 - u;
    let v = u * w + S * d;
    const L = [], k = [];
    let b = 0, A = 0, M = 0, Y = 0, F;
    for (let G = 0, D = f.length; G < D; G += 2) {
      const K = f[G];
      if (K === `
`) {
        A += b, b = 0, v = u * w + S * d, ++Y;
        continue;
      }
      const V = f[G + 1] || l.font;
      V !== F && (s && L.push("font", V), i && k.push("font", V), F = V), b = Math.max(b, p[M]);
      const Q = [
        K,
        v + S * _[M] + u * (_[M] - E[Y]),
        0.5 * (d + b) + A
      ];
      v += _[M], s && L.push("strokeText", Q), i && k.push("fillText", Q), ++M;
    }
    return Array.prototype.push.apply(y, L), Array.prototype.push.apply(y, k), this.labels_[r] = T, T;
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../coordinate.js").Coordinate} p1 1st point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p2 2nd point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p3 3rd point of the background box.
   * @param {import("../../coordinate.js").Coordinate} p4 4th point of the background box.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   */
  replayTextBackground_(t, e, i, s, r, o, a) {
    t.beginPath(), t.moveTo.apply(t, e), t.lineTo.apply(t, i), t.lineTo.apply(t, s), t.lineTo.apply(t, r), t.lineTo.apply(t, e), o && (this.alignAndScaleFill_ = /** @type {number} */
    o[2], t.fillStyle = /** @type {string} */
    o[1], this.fill_(t)), a && (this.setStrokeStyle_(
      t,
      /** @type {Array<*>} */
      a
    ), t.stroke());
  }
  /**
   * @private
   * @param {number} sheetWidth Width of the sprite sheet.
   * @param {number} sheetHeight Height of the sprite sheet.
   * @param {number} centerX X.
   * @param {number} centerY Y.
   * @param {number} width Width.
   * @param {number} height Height.
   * @param {number} anchorX Anchor X.
   * @param {number} anchorY Anchor Y.
   * @param {number} originX Origin X.
   * @param {number} originY Origin Y.
   * @param {number} rotation Rotation.
   * @param {import("../../size.js").Size} scale Scale.
   * @param {boolean} snapToPixel Snap to pixel.
   * @param {Array<number>} padding Padding.
   * @param {boolean} fillStroke Background fill or stroke.
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @return {ImageOrLabelDimensions} Dimensions for positioning and decluttering the image or label.
   */
  calculateImageOrLabelDimensions_(t, e, i, s, r, o, a, l, c, h, u, d, f, g, m, _) {
    a *= d[0], l *= d[1];
    let p = i - a, E = s - l;
    const w = r + c > t ? t - c : r, y = o + h > e ? e - h : o, x = g[3] + w * d[0] + g[1], R = g[0] + y * d[1] + g[2], T = p - g[3], S = E - g[0];
    (m || u !== 0) && (we[0] = T, Ce[0] = T, we[1] = S, le[1] = S, le[0] = T + x, he[0] = le[0], he[1] = S + R, Ce[1] = he[1]);
    let v;
    return u !== 0 ? (v = pe(
      jt(),
      i,
      s,
      1,
      1,
      u,
      -i,
      -s
    ), dt(v, we), dt(v, le), dt(v, he), dt(v, Ce), be(
      Math.min(we[0], le[0], he[0], Ce[0]),
      Math.min(we[1], le[1], he[1], Ce[1]),
      Math.max(we[0], le[0], he[0], Ce[0]),
      Math.max(we[1], le[1], he[1], Ce[1]),
      ai
    )) : be(
      Math.min(T, T + x),
      Math.min(S, S + R),
      Math.max(T, T + x),
      Math.max(S, S + R),
      ai
    ), f && (p = Math.round(p), E = Math.round(E)), {
      drawImageX: p,
      drawImageY: E,
      drawImageW: w,
      drawImageH: y,
      originX: c,
      originY: h,
      declutterBox: {
        minX: ai[0],
        minY: ai[1],
        maxX: ai[2],
        maxY: ai[3],
        value: _
      },
      canvasTransform: v,
      scale: d
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scaled canvas size.
   * @param {import("../canvas.js").Label|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} imageOrLabel Image.
   * @param {ImageOrLabelDimensions} dimensions Dimensions.
   * @param {number} opacity Opacity.
   * @param {Array<*>} fillInstruction Fill instruction.
   * @param {Array<*>} strokeInstruction Stroke instruction.
   * @return {boolean} The image or label was rendered.
   */
  replayImageOrLabel_(t, e, i, s, r, o, a) {
    const l = !!(o || a), c = s.declutterBox, h = a ? a[2] * s.scale[0] / 2 : 0;
    return c.minX - h <= e[0] && c.maxX + h >= 0 && c.minY - h <= e[1] && c.maxY + h >= 0 && (l && this.replayTextBackground_(
      t,
      we,
      le,
      he,
      Ce,
      /** @type {Array<*>} */
      o,
      /** @type {Array<*>} */
      a
    ), ju(
      t,
      s.canvasTransform,
      r,
      i,
      s.originX,
      s.originY,
      s.drawImageW,
      s.drawImageH,
      s.drawImageX,
      s.drawImageY,
      s.scale
    )), !0;
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   */
  fill_(t) {
    const e = this.alignAndScaleFill_;
    if (e) {
      const i = dt(this.renderedTransform_, [0, 0]), s = 512 * this.pixelRatio;
      t.save(), t.translate(i[0] % s, i[1] % s), e !== 1 && t.scale(e, e), t.rotate(this.viewRotation_);
    }
    t.fill(), e && t.restore();
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {Array<*>} instruction Instruction.
   */
  setStrokeStyle_(t, e) {
    t.strokeStyle = /** @type {import("../../colorlike.js").ColorLike} */
    e[1], t.lineWidth = /** @type {number} */
    e[2], t.lineCap = /** @type {CanvasLineCap} */
    e[3], t.lineJoin = /** @type {CanvasLineJoin} */
    e[4], t.miterLimit = /** @type {number} */
    e[5], t.lineDashOffset = /** @type {number} */
    e[7], t.setLineDash(
      /** @type {Array<number>} */
      e[6]
    );
  }
  /**
   * @private
   * @param {string|Array<string>} text The text to draw.
   * @param {string} textKey The key of the text state.
   * @param {string} strokeKey The key for the stroke state.
   * @param {string} fillKey The key for the fill state.
   * @return {{label: import("../canvas.js").Label, anchorX: number, anchorY: number}} The text image and its anchor.
   */
  drawLabelWithPointPlacement_(t, e, i, s) {
    const r = this.textStates[e], o = this.createLabel(t, e, s, i), a = this.strokeStates[i], l = this.pixelRatio, c = js(
      Array.isArray(t) ? t[0] : t,
      r.textAlign || an
    ), h = Jn[r.textBaseline || Un], u = a && a.lineWidth ? a.lineWidth : 0, d = o.width / l - 2 * r.scale[0], f = c * d + 2 * (0.5 - c) * u, g = h * o.height / l + 2 * (0.5 - h) * u;
    return {
      label: o,
      anchorX: f,
      anchorY: g
    };
  }
  /**
   * @private
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scaled canvas size
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {Array<*>} instructions Instructions array.
   * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
   * @param {FeatureCallback<T>} [featureCallback] Feature callback.
   * @param {import("../../extent.js").Extent} [hitExtent] Only check
   *     features that intersect this extent.
   * @param {import("rbush").default<DeclutterEntry>} [declutterTree] Declutter tree.
   * @return {T|undefined} Callback result.
   * @template T
   */
  execute_(t, e, i, s, r, o, a, l) {
    const c = this.zIndexContext_;
    let h;
    this.pixelCoordinates_ && Pe(i, this.renderedTransform_) ? h = this.pixelCoordinates_ : (this.pixelCoordinates_ || (this.pixelCoordinates_ = []), h = Me(
      this.coordinates,
      0,
      this.coordinates.length,
      2,
      i,
      this.pixelCoordinates_
    ), Vh(this.renderedTransform_, i));
    let u = 0;
    const d = s.length;
    let f = 0, g, m, _, p, E, w, y, x, R, T, S, v, L, k = 0, b = 0;
    const A = this.coordinateCache_, M = this.viewRotation_, Y = Math.round(Math.atan2(-i[1], i[0]) * 1e12) / 1e12, F = (
      /** @type {import("../../render.js").State} */
      {
        context: t,
        pixelRatio: this.pixelRatio,
        resolution: this.resolution,
        rotation: M
      }
    ), G = this.instructions != s || this.overlaps ? 0 : 200;
    let D, K, V, Q;
    for (; u < d; ) {
      const I = s[u];
      switch (
        /** @type {import("./Instruction.js").default} */
        I[0]
      ) {
        case P.BEGIN_GEOMETRY:
          D = /** @type {import("../../Feature.js").FeatureLike} */
          I[1], Q = I[3], D.getGeometry() ? a !== void 0 && !It(a, Q.getExtent()) ? u = /** @type {number} */
          I[2] + 1 : ++u : u = /** @type {number} */
          I[2], c && (c.zIndex = I[4]);
          break;
        case P.BEGIN_PATH:
          k > G && (this.fill_(t), k = 0), b > G && (t.stroke(), b = 0), !k && !b && (t.beginPath(), E = NaN, w = NaN), ++u;
          break;
        case P.CIRCLE:
          f = /** @type {number} */
          I[1];
          const xt = h[f], st = h[f + 1], Mt = h[f + 2], mt = h[f + 3], Jt = Mt - xt, Kt = mt - st, bt = Math.sqrt(Jt * Jt + Kt * Kt);
          t.moveTo(xt + bt, st), t.arc(xt, st, bt, 0, 2 * Math.PI, !0), ++u;
          break;
        case P.CLOSE_PATH:
          t.closePath(), ++u;
          break;
        case P.CUSTOM:
          f = /** @type {number} */
          I[1], g = I[2];
          const En = (
            /** @type {import("../../geom/SimpleGeometry.js").default} */
            I[3]
          ), Es = I[4], Oi = I[5];
          F.geometry = En, F.feature = D, u in A || (A[u] = []);
          const Oe = A[u];
          Oi ? Oi(h, f, g, 2, Oe) : (Oe[0] = h[f], Oe[1] = h[f + 1], Oe.length = 2), c && (c.zIndex = I[6]), Es(Oe, F), ++u;
          break;
        case P.DRAW_IMAGE:
          f = /** @type {number} */
          I[1], g = /** @type {number} */
          I[2], R = /** @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} */
          I[3], m = /** @type {number} */
          I[4], _ = /** @type {number} */
          I[5];
          let Pt = (
            /** @type {number} */
            I[6]
          );
          const Qt = (
            /** @type {number} */
            I[7]
          ), Je = (
            /** @type {number} */
            I[8]
          ), Qe = (
            /** @type {number} */
            I[9]
          ), Di = (
            /** @type {boolean} */
            I[10]
          );
          let De = (
            /** @type {number} */
            I[11]
          );
          const ti = (
            /** @type {import("../../size.js").Size} */
            I[12]
          );
          let ei = (
            /** @type {number} */
            I[13]
          );
          p = I[14] || "declutter";
          const ct = (
            /** @type {{args: import("../canvas.js").DeclutterImageWithText, declutterMode: import('../../style/Style.js').DeclutterMode}} */
            I[15]
          );
          if (!R && I.length >= 20) {
            T = /** @type {string} */
            I[19], S = /** @type {string} */
            I[20], v = /** @type {string} */
            I[21], L = /** @type {string} */
            I[22];
            const Ot = this.drawLabelWithPointPlacement_(
              T,
              S,
              v,
              L
            );
            R = Ot.label, I[3] = R;
            const Fe = (
              /** @type {number} */
              I[23]
            );
            m = (Ot.anchorX - Fe) * this.pixelRatio, I[4] = m;
            const Dt = (
              /** @type {number} */
              I[24]
            );
            _ = (Ot.anchorY - Dt) * this.pixelRatio, I[5] = _, Pt = R.height, I[6] = Pt, ei = R.width, I[13] = ei;
          }
          let xs;
          I.length > 25 && (xs = /** @type {number} */
          I[25]);
          let ws, xn, wn;
          I.length > 17 ? (ws = /** @type {Array<number>} */
          I[16], xn = /** @type {Array<*>} */
          I[17], wn = /** @type {Array<*>} */
          I[18]) : (ws = Ye, xn = null, wn = null), Di && Y ? De += M : !Di && !Y && (De -= M);
          let Gl = 0;
          for (; f < g; f += 2) {
            if (xs && xs[Gl++] < ei / this.pixelRatio)
              continue;
            const Ot = this.calculateImageOrLabelDimensions_(
              R.width,
              R.height,
              h[f],
              h[f + 1],
              ei,
              Pt,
              m,
              _,
              Je,
              Qe,
              De,
              ti,
              r,
              ws,
              !!xn || !!wn,
              D
            ), Fe = [
              t,
              e,
              R,
              Ot,
              Qt,
              xn,
              wn
            ];
            if (l) {
              let Dt, te, Ft;
              if (ct) {
                const nt = g - f;
                if (!ct[nt]) {
                  ct[nt] = { args: Fe, declutterMode: p };
                  continue;
                }
                const wt = ct[nt];
                Dt = wt.args, te = wt.declutterMode, delete ct[nt], Ft = ia(Dt);
              }
              let re, oe;
              if (Dt && (te !== "declutter" || !l.collides(Ft)) && (re = !0), (p !== "declutter" || !l.collides(Ot.declutterBox)) && (oe = !0), te === "declutter" && p === "declutter") {
                const nt = re && oe;
                re = nt, oe = nt;
              }
              re && (te !== "none" && l.insert(Ft), this.replayImageOrLabel_.apply(this, Dt)), oe && (p !== "none" && l.insert(Ot.declutterBox), this.replayImageOrLabel_.apply(this, Fe));
            } else
              this.replayImageOrLabel_.apply(this, Fe);
          }
          ++u;
          break;
        case P.DRAW_CHARS:
          const qr = (
            /** @type {number} */
            I[1]
          ), Jr = (
            /** @type {number} */
            I[2]
          ), Cs = (
            /** @type {number} */
            I[3]
          ), zl = (
            /** @type {number} */
            I[4]
          );
          L = /** @type {string} */
          I[5];
          const Wl = (
            /** @type {number} */
            I[6]
          ), Qr = (
            /** @type {number} */
            I[7]
          ), to = (
            /** @type {number} */
            I[8]
          );
          v = /** @type {string} */
          I[9];
          const Rs = (
            /** @type {number} */
            I[10]
          );
          T = /** @type {string|Array<string>} */
          I[11], Array.isArray(T) && (T = T.reduce(Hd, "")), S = /** @type {string} */
          I[12];
          const eo = [
            /** @type {number} */
            I[13],
            /** @type {number} */
            I[13]
          ];
          p = I[14] || "declutter";
          const Xl = (
            /** @type {boolean} */
            I[15]
          ), Ss = this.textStates[S], Fi = Ss.font, ki = [
            Ss.scale[0] * Qr,
            Ss.scale[1] * Qr
          ];
          let Ni;
          Fi in this.widths_ ? Ni = this.widths_[Fi] : (Ni = {}, this.widths_[Fi] = Ni);
          const io = Zd(h, qr, Jr, 2), no = Math.abs(ki[0]) * Wo(Fi, T, Ni);
          if (zl || no <= io) {
            const Ot = this.textStates[S].textAlign, Fe = (io - no) * js(T, Ot), Dt = Ud(
              h,
              qr,
              Jr,
              2,
              T,
              Fe,
              Wl,
              Math.abs(ki[0]),
              Wo,
              Fi,
              Ni,
              Y ? 0 : this.viewRotation_,
              Xl
            );
            t: if (Dt) {
              const te = [];
              let Ft, re, oe, nt, wt;
              if (v)
                for (Ft = 0, re = Dt.length; Ft < re; ++Ft) {
                  wt = Dt[Ft], oe = /** @type {string} */
                  wt[4], nt = this.createLabel(oe, S, "", v), m = /** @type {number} */
                  wt[2] + (ki[0] < 0 ? -Rs : Rs), _ = Cs * nt.height + (0.5 - Cs) * 2 * Rs * ki[1] / ki[0] - to;
                  const ae = this.calculateImageOrLabelDimensions_(
                    nt.width,
                    nt.height,
                    wt[0],
                    wt[1],
                    nt.width,
                    nt.height,
                    m,
                    _,
                    0,
                    0,
                    wt[3],
                    eo,
                    !1,
                    Ye,
                    !1,
                    D
                  );
                  if (l && p === "declutter" && l.collides(ae.declutterBox))
                    break t;
                  te.push([
                    t,
                    e,
                    nt,
                    ae,
                    1,
                    null,
                    null
                  ]);
                }
              if (L)
                for (Ft = 0, re = Dt.length; Ft < re; ++Ft) {
                  wt = Dt[Ft], oe = /** @type {string} */
                  wt[4], nt = this.createLabel(oe, S, L, ""), m = /** @type {number} */
                  wt[2], _ = Cs * nt.height - to;
                  const ae = this.calculateImageOrLabelDimensions_(
                    nt.width,
                    nt.height,
                    wt[0],
                    wt[1],
                    nt.width,
                    nt.height,
                    m,
                    _,
                    0,
                    0,
                    wt[3],
                    eo,
                    !1,
                    Ye,
                    !1,
                    D
                  );
                  if (l && p === "declutter" && l.collides(ae.declutterBox))
                    break t;
                  te.push([
                    t,
                    e,
                    nt,
                    ae,
                    1,
                    null,
                    null
                  ]);
                }
              l && p !== "none" && l.load(te.map(ia));
              for (let ae = 0, Yl = te.length; ae < Yl; ++ae)
                this.replayImageOrLabel_.apply(this, te[ae]);
            }
          }
          ++u;
          break;
        case P.END_GEOMETRY:
          if (o !== void 0) {
            D = /** @type {import("../../Feature.js").FeatureLike} */
            I[1];
            const Ot = o(
              D,
              Q,
              p
            );
            if (Ot)
              return Ot;
          }
          ++u;
          break;
        case P.FILL:
          G ? k++ : this.fill_(t), ++u;
          break;
        case P.MOVE_TO_LINE_TO:
          for (f = /** @type {number} */
          I[1], g = /** @type {number} */
          I[2], K = h[f], V = h[f + 1], t.moveTo(K, V), E = K + 0.5 | 0, w = V + 0.5 | 0, f += 2; f < g; f += 2)
            K = h[f], V = h[f + 1], y = K + 0.5 | 0, x = V + 0.5 | 0, (f == g - 2 || y !== E || x !== w) && (t.lineTo(K, V), E = y, w = x);
          ++u;
          break;
        case P.SET_FILL_STYLE:
          this.alignAndScaleFill_ = I[2], k && (this.fill_(t), k = 0, b && (t.stroke(), b = 0)), t.fillStyle = I[1], ++u;
          break;
        case P.SET_STROKE_STYLE:
          b && (t.stroke(), b = 0), this.setStrokeStyle_(
            t,
            /** @type {Array<*>} */
            I
          ), ++u;
          break;
        case P.STROKE:
          G ? b++ : t.stroke(), ++u;
          break;
        default:
          ++u;
          break;
      }
    }
    k && this.fill_(t), b && t.stroke();
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scaled canvas size.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {boolean} snapToPixel Snap point symbols and text to integer pixels.
   * @param {import("rbush").default<DeclutterEntry>} [declutterTree] Declutter tree.
   */
  execute(t, e, i, s, r, o) {
    this.viewRotation_ = s, this.execute_(
      t,
      e,
      i,
      this.instructions,
      r,
      void 0,
      void 0,
      o
    );
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {FeatureCallback<T>} [featureCallback] Feature callback.
   * @param {import("../../extent.js").Extent} [hitExtent] Only check
   *     features that intersect this extent.
   * @return {T|undefined} Callback result.
   * @template T
   */
  executeHitDetection(t, e, i, s, r) {
    return this.viewRotation_ = i, this.execute_(
      t,
      [t.canvas.width, t.canvas.height],
      e,
      this.hitDetectionInstructions,
      !0,
      s,
      r
    );
  }
}
const mi = [
  "Polygon",
  "Circle",
  "LineString",
  "Image",
  "Text",
  "Default"
], Il = ["Image", "Text"], qd = mi.filter(
  (n) => !Il.includes(n)
);
class Jd {
  /**
   * @param {import("../../extent.js").Extent} maxExtent Max extent for clipping. When a
   * `maxExtent` was set on the Builder for this executor group, the same `maxExtent`
   * should be set here, unless the target context does not exceed that extent (which
   * can be the case when rendering to tiles).
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {boolean} overlaps The executor group can have overlapping geometries.
   * @param {!Object<string, !Object<import("../canvas.js").BuilderType, import("../canvas.js").SerializableInstructions>>} allInstructions
   * The serializable instructions.
   * @param {number} [renderBuffer] Optional rendering buffer.
   * @param {boolean} [deferredRendering] Enable deferred rendering with renderDeferred().
   */
  constructor(t, e, i, s, r, o, a) {
    this.maxExtent_ = t, this.overlaps_ = s, this.pixelRatio_ = i, this.resolution_ = e, this.renderBuffer_ = o, this.executorsByZIndex_ = {}, this.hitDetectionContext_ = null, this.hitDetectionTransform_ = jt(), this.renderedContext_ = null, this.deferredZIndexContexts_ = {}, this.createExecutors_(r, a);
  }
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../transform.js").Transform} transform Transform.
   */
  clip(t, e) {
    const i = this.getClipCoords(e);
    t.beginPath(), t.moveTo(i[0], i[1]), t.lineTo(i[2], i[3]), t.lineTo(i[4], i[5]), t.lineTo(i[6], i[7]), t.clip();
  }
  /**
   * Create executors and populate them using the provided instructions.
   * @private
   * @param {!Object<string, !Object<string, import("../canvas.js").SerializableInstructions>>} allInstructions The serializable instructions
   * @param {boolean} deferredRendering Enable deferred rendering.
   */
  createExecutors_(t, e) {
    for (const i in t) {
      let s = this.executorsByZIndex_[i];
      s === void 0 && (s = {}, this.executorsByZIndex_[i] = s);
      const r = t[i];
      for (const o in r) {
        const a = r[o];
        s[o] = new $d(
          this.resolution_,
          this.pixelRatio_,
          this.overlaps_,
          a,
          e
        );
      }
    }
  }
  /**
   * @param {Array<import("../canvas.js").BuilderType>} executors Executors.
   * @return {boolean} Has executors of the provided types.
   */
  hasExecutors(t) {
    for (const e in this.executorsByZIndex_) {
      const i = this.executorsByZIndex_[e];
      for (let s = 0, r = t.length; s < r; ++s)
        if (t[s] in i)
          return !0;
    }
    return !1;
  }
  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(import("../../Feature.js").FeatureLike, import("../../geom/SimpleGeometry.js").default, number): T} callback Feature callback.
   * @param {Array<import("../../Feature.js").FeatureLike>} declutteredFeatures Decluttered features.
   * @return {T|undefined} Callback result.
   * @template T
   */
  forEachFeatureAtCoordinate(t, e, i, s, r, o) {
    s = Math.round(s);
    const a = s * 2 + 1, l = pe(
      this.hitDetectionTransform_,
      s + 0.5,
      s + 0.5,
      1 / e,
      -1 / e,
      -i,
      -t[0],
      -t[1]
    ), c = !this.hitDetectionContext_;
    c && (this.hitDetectionContext_ = at(
      a,
      a
    ));
    const h = this.hitDetectionContext_;
    h.canvas.width !== a || h.canvas.height !== a ? (h.canvas.width = a, h.canvas.height = a) : c || h.clearRect(0, 0, a, a);
    let u;
    this.renderBuffer_ !== void 0 && (u = Yt(), ji(u, t), mr(
      u,
      e * (this.renderBuffer_ + s),
      u
    ));
    const d = Qd(s);
    let f;
    function g(x, R, T) {
      const S = h.getImageData(
        0,
        0,
        a,
        a
      ).data;
      for (let v = 0, L = d.length; v < L; v++)
        if (S[d[v]] > 0) {
          if (!o || T === "none" || f !== "Image" && f !== "Text" || o.includes(x)) {
            const k = (d[v] - 3) / 4, b = s - k % a, A = s - (k / a | 0), M = r(x, R, b * b + A * A);
            if (M)
              return M;
          }
          h.clearRect(0, 0, a, a);
          break;
        }
    }
    const m = Object.keys(this.executorsByZIndex_).map(Number);
    m.sort(ge);
    let _, p, E, w, y;
    for (_ = m.length - 1; _ >= 0; --_) {
      const x = m[_].toString();
      for (E = this.executorsByZIndex_[x], p = mi.length - 1; p >= 0; --p)
        if (f = mi[p], w = E[f], w !== void 0 && (y = w.executeHitDetection(
          h,
          l,
          i,
          g,
          u
        ), y))
          return y;
    }
  }
  /**
   * @param {import("../../transform.js").Transform} transform Transform.
   * @return {Array<number>|null} Clip coordinates.
   */
  getClipCoords(t) {
    const e = this.maxExtent_;
    if (!e)
      return null;
    const i = e[0], s = e[1], r = e[2], o = e[3], a = [i, s, i, o, r, o, r, s];
    return Me(a, 0, 8, 2, t, a), a;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return Ci(this.executorsByZIndex_);
  }
  /**
   * @param {CanvasRenderingContext2D} targetContext Context.
   * @param {import('../../size.js').Size} scaledCanvasSize Scale of the context.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {boolean} snapToPixel Snap point symbols and test to integer pixel.
   * @param {Array<import("../canvas.js").BuilderType>} [builderTypes] Ordered replay types to replay.
   *     Default is {@link module:ol/render/replay~ALL}
   * @param {import("rbush").default<import('./Executor.js').DeclutterEntry>|null} [declutterTree] Declutter tree.
   *     When set to null, no decluttering is done, even when the executor group has a `ZIndexContext`.
   */
  execute(t, e, i, s, r, o, a) {
    const l = Object.keys(this.executorsByZIndex_).map(Number);
    l.sort(a ? Bl : ge), o = o || mi;
    const c = mi.length;
    for (let h = 0, u = l.length; h < u; ++h) {
      const d = l[h].toString(), f = this.executorsByZIndex_[d];
      for (let g = 0, m = o.length; g < m; ++g) {
        const _ = o[g], p = f[_];
        if (p !== void 0) {
          const E = a === null ? void 0 : p.getZIndexContext(), w = E ? E.getContext() : t, y = this.maxExtent_ && _ !== "Image" && _ !== "Text";
          if (y && (w.save(), this.clip(w, i)), !E || _ === "Text" || _ === "Image" ? p.execute(
            w,
            e,
            i,
            s,
            r,
            a
          ) : E.pushFunction(
            (x) => p.execute(
              x,
              e,
              i,
              s,
              r,
              a
            )
          ), y && w.restore(), E) {
            E.offset();
            const x = l[h] * c + g;
            this.deferredZIndexContexts_[x] || (this.deferredZIndexContexts_[x] = []), this.deferredZIndexContexts_[x].push(E);
          }
        }
      }
    }
    this.renderedContext_ = t;
  }
  getDeferredZIndexContexts() {
    return this.deferredZIndexContexts_;
  }
  getRenderedContext() {
    return this.renderedContext_;
  }
  renderDeferred() {
    const t = this.deferredZIndexContexts_, e = Object.keys(t).map(Number).sort(ge);
    for (let i = 0, s = e.length; i < s; ++i)
      t[e[i]].forEach((r) => {
        r.draw(this.renderedContext_), r.clear();
      }), t[e[i]].length = 0;
  }
}
const Hs = {};
function Qd(n) {
  if (Hs[n] !== void 0)
    return Hs[n];
  const t = n * 2 + 1, e = n * n, i = new Array(e + 1);
  for (let r = 0; r <= n; ++r)
    for (let o = 0; o <= n; ++o) {
      const a = r * r + o * o;
      if (a > e)
        break;
      let l = i[a];
      l || (l = [], i[a] = l), l.push(((n + r) * t + (n + o)) * 4 + 3), r > 0 && l.push(((n - r) * t + (n + o)) * 4 + 3), o > 0 && (l.push(((n + r) * t + (n - o)) * 4 + 3), r > 0 && l.push(((n - r) * t + (n - o)) * 4 + 3));
    }
  const s = [];
  for (let r = 0, o = i.length; r < o; ++r)
    i[r] && s.push(...i[r]);
  return Hs[n] = s, s;
}
class tf extends Tl {
  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../extent.js").Extent} extent Extent.
   * @param {import("../../transform.js").Transform} transform Transform.
   * @param {number} viewRotation View rotation.
   * @param {number} [squaredTolerance] Optional squared tolerance for simplification.
   * @param {import("../../proj.js").TransformFunction} [userTransform] Transform from user to view projection.
   */
  constructor(t, e, i, s, r, o, a) {
    super(), this.context_ = t, this.pixelRatio_ = e, this.extent_ = i, this.transform_ = s, this.transformRotation_ = s ? is(Math.atan2(s[1], s[0]), 10) : 0, this.viewRotation_ = r, this.squaredTolerance_ = o, this.userTransform_ = a, this.contextFillState_ = null, this.contextStrokeState_ = null, this.contextTextState_ = null, this.fillState_ = null, this.strokeState_ = null, this.image_ = null, this.imageAnchorX_ = 0, this.imageAnchorY_ = 0, this.imageHeight_ = 0, this.imageOpacity_ = 0, this.imageOriginX_ = 0, this.imageOriginY_ = 0, this.imageRotateWithView_ = !1, this.imageRotation_ = 0, this.imageScale_ = [0, 0], this.imageWidth_ = 0, this.text_ = "", this.textOffsetX_ = 0, this.textOffsetY_ = 0, this.textRotateWithView_ = !1, this.textRotation_ = 0, this.textScale_ = [0, 0], this.textFillState_ = null, this.textStrokeState_ = null, this.textState_ = null, this.pixelCoordinates_ = [], this.tmpLocalTransform_ = jt();
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  drawImages_(t, e, i, s) {
    if (!this.image_)
      return;
    const r = Me(
      t,
      e,
      i,
      s,
      this.transform_,
      this.pixelCoordinates_
    ), o = this.context_, a = this.tmpLocalTransform_, l = o.globalAlpha;
    this.imageOpacity_ != 1 && (o.globalAlpha = l * this.imageOpacity_);
    let c = this.imageRotation_;
    this.transformRotation_ === 0 && (c -= this.viewRotation_), this.imageRotateWithView_ && (c += this.viewRotation_);
    for (let h = 0, u = r.length; h < u; h += 2) {
      const d = r[h] - this.imageAnchorX_, f = r[h + 1] - this.imageAnchorY_;
      if (c !== 0 || this.imageScale_[0] != 1 || this.imageScale_[1] != 1) {
        const g = d + this.imageAnchorX_, m = f + this.imageAnchorY_;
        pe(
          a,
          g,
          m,
          1,
          1,
          c,
          -g,
          -m
        ), o.save(), o.transform.apply(o, a), o.translate(g, m), o.scale(this.imageScale_[0], this.imageScale_[1]), o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          -this.imageAnchorX_,
          -this.imageAnchorY_,
          this.imageWidth_,
          this.imageHeight_
        ), o.restore();
      } else
        o.drawImage(
          this.image_,
          this.imageOriginX_,
          this.imageOriginY_,
          this.imageWidth_,
          this.imageHeight_,
          d,
          f,
          this.imageWidth_,
          this.imageHeight_
        );
    }
    this.imageOpacity_ != 1 && (o.globalAlpha = l);
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  drawText_(t, e, i, s) {
    if (!this.textState_ || this.text_ === "")
      return;
    this.textFillState_ && this.setContextFillState_(this.textFillState_), this.textStrokeState_ && this.setContextStrokeState_(this.textStrokeState_), this.setContextTextState_(this.textState_);
    const r = Me(
      t,
      e,
      i,
      s,
      this.transform_,
      this.pixelCoordinates_
    ), o = this.context_;
    let a = this.textRotation_;
    for (this.transformRotation_ === 0 && (a -= this.viewRotation_), this.textRotateWithView_ && (a += this.viewRotation_); e < i; e += s) {
      const l = r[e] + this.textOffsetX_, c = r[e + 1] + this.textOffsetY_;
      a !== 0 || this.textScale_[0] != 1 || this.textScale_[1] != 1 ? (o.save(), o.translate(l - this.textOffsetX_, c - this.textOffsetY_), o.rotate(a), o.translate(this.textOffsetX_, this.textOffsetY_), o.scale(this.textScale_[0], this.textScale_[1]), this.textStrokeState_ && o.strokeText(this.text_, 0, 0), this.textFillState_ && o.fillText(this.text_, 0, 0), o.restore()) : (this.textStrokeState_ && o.strokeText(this.text_, l, c), this.textFillState_ && o.fillText(this.text_, l, c));
    }
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} close Close.
   * @private
   * @return {number} end End.
   */
  moveToLineTo_(t, e, i, s, r) {
    const o = this.context_, a = Me(
      t,
      e,
      i,
      s,
      this.transform_,
      this.pixelCoordinates_
    );
    o.moveTo(a[0], a[1]);
    let l = a.length;
    r && (l -= 2);
    for (let c = 2; c < l; c += 2)
      o.lineTo(a[c], a[c + 1]);
    return r && o.closePath(), i;
  }
  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  drawRings_(t, e, i, s) {
    for (let r = 0, o = i.length; r < o; ++r)
      e = this.moveToLineTo_(
        t,
        e,
        i[r],
        s,
        !0
      );
    return e;
  }
  /**
   * Render a circle geometry into the canvas.  Rendering is immediate and uses
   * the current fill and stroke styles.
   *
   * @param {import("../../geom/Circle.js").default} geometry Circle geometry.
   * @api
   * @override
   */
  drawCircle(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/Circle.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!It(this.extent_, t.getExtent())) {
      if (this.fillState_ || this.strokeState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = ec(
          t,
          this.transform_,
          this.pixelCoordinates_
        ), i = e[2] - e[0], s = e[3] - e[1], r = Math.sqrt(i * i + s * s), o = this.context_;
        o.beginPath(), o.arc(
          e[0],
          e[1],
          r,
          0,
          2 * Math.PI
        ), this.fillState_ && o.fill(), this.strokeState_ && o.stroke();
      }
      this.text_ !== "" && this.drawText_(t.getCenter(), 0, 2, 2);
    }
  }
  /**
   * Set the rendering style.  Note that since this is an immediate rendering API,
   * any `zIndex` on the provided style will be ignored.
   *
   * @param {import("../../style/Style.js").default} style The rendering style.
   * @api
   * @override
   */
  setStyle(t) {
    this.setFillStrokeStyle(t.getFill(), t.getStroke()), this.setImageStyle(t.getImage()), this.setTextStyle(t.getText());
  }
  /**
   * @param {import("../../transform.js").Transform} transform Transform.
   */
  setTransform(t) {
    this.transform_ = t;
  }
  /**
   * Render a geometry into the canvas.  Call
   * {@link module:ol/render/canvas/Immediate~CanvasImmediateRenderer#setStyle renderer.setStyle()} first to set the rendering style.
   *
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
   * @api
   * @override
   */
  drawGeometry(t) {
    switch (t.getType()) {
      case "Point":
        this.drawPoint(
          /** @type {import("../../geom/Point.js").default} */
          t
        );
        break;
      case "LineString":
        this.drawLineString(
          /** @type {import("../../geom/LineString.js").default} */
          t
        );
        break;
      case "Polygon":
        this.drawPolygon(
          /** @type {import("../../geom/Polygon.js").default} */
          t
        );
        break;
      case "MultiPoint":
        this.drawMultiPoint(
          /** @type {import("../../geom/MultiPoint.js").default} */
          t
        );
        break;
      case "MultiLineString":
        this.drawMultiLineString(
          /** @type {import("../../geom/MultiLineString.js").default} */
          t
        );
        break;
      case "MultiPolygon":
        this.drawMultiPolygon(
          /** @type {import("../../geom/MultiPolygon.js").default} */
          t
        );
        break;
      case "GeometryCollection":
        this.drawGeometryCollection(
          /** @type {import("../../geom/GeometryCollection.js").default} */
          t
        );
        break;
      case "Circle":
        this.drawCircle(
          /** @type {import("../../geom/Circle.js").default} */
          t
        );
        break;
    }
  }
  /**
   * Render a feature into the canvas.  Note that any `zIndex` on the provided
   * style will be ignored - features are rendered immediately in the order that
   * this method is called.  If you need `zIndex` support, you should be using an
   * {@link module:ol/layer/Vector~VectorLayer} instead.
   *
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {import("../../style/Style.js").default} style Style.
   * @api
   * @override
   */
  drawFeature(t, e) {
    const i = e.getGeometryFunction()(t);
    i && (this.setStyle(e), this.drawGeometry(i));
  }
  /**
   * Render a GeometryCollection to the canvas.  Rendering is immediate and
   * uses the current styles appropriate for each geometry in the collection.
   *
   * @param {import("../../geom/GeometryCollection.js").default} geometry Geometry collection.
   * @override
   */
  drawGeometryCollection(t) {
    const e = t.getGeometriesArray();
    for (let i = 0, s = e.length; i < s; ++i)
      this.drawGeometry(e[i]);
  }
  /**
   * Render a Point geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} geometry Point geometry.
   * @override
   */
  drawPoint(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/Point.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getFlatCoordinates(), i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  /**
   * Render a MultiPoint geometry  into the canvas.  Rendering is immediate and
   * uses the current style.
   *
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} geometry MultiPoint geometry.
   * @override
   */
  drawMultiPoint(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiPoint.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getFlatCoordinates(), i = t.getStride();
    this.image_ && this.drawImages_(e, 0, e.length, i), this.text_ !== "" && this.drawText_(e, 0, e.length, i);
  }
  /**
   * Render a LineString into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} geometry LineString geometry.
   * @override
   */
  drawLineString(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/LineString.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!It(this.extent_, t.getExtent())) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const e = this.context_, i = t.getFlatCoordinates();
        e.beginPath(), this.moveToLineTo_(
          i,
          0,
          i.length,
          t.getStride(),
          !1
        ), e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatMidpoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  /**
   * Render a MultiLineString geometry into the canvas.  Rendering is immediate
   * and uses the current style.
   *
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} geometry MultiLineString geometry.
   * @override
   */
  drawMultiLineString(t) {
    this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiLineString.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    ));
    const e = t.getExtent();
    if (It(this.extent_, e)) {
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
        const i = this.context_, s = t.getFlatCoordinates();
        let r = 0;
        const o = (
          /** @type {Array<number>} */
          t.getEnds()
        ), a = t.getStride();
        i.beginPath();
        for (let l = 0, c = o.length; l < c; ++l)
          r = this.moveToLineTo_(
            s,
            r,
            o[l],
            a,
            !1
          );
        i.stroke();
      }
      if (this.text_ !== "") {
        const i = t.getFlatMidpoints();
        this.drawText_(i, 0, i.length, 2);
      }
    }
  }
  /**
   * Render a Polygon geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} geometry Polygon geometry.
   * @override
   */
  drawPolygon(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/Polygon.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!It(this.extent_, t.getExtent())) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_;
        e.beginPath(), this.drawRings_(
          t.getOrientedFlatCoordinates(),
          0,
          /** @type {Array<number>} */
          t.getEnds(),
          t.getStride()
        ), this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoint();
        this.drawText_(e, 0, 2, 2);
      }
    }
  }
  /**
   * Render MultiPolygon geometry into the canvas.  Rendering is immediate and
   * uses the current style.
   * @param {import("../../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
   * @override
   */
  drawMultiPolygon(t) {
    if (this.squaredTolerance_ && (t = /** @type {import("../../geom/MultiPolygon.js").default} */
    t.simplifyTransformed(
      this.squaredTolerance_,
      this.userTransform_
    )), !!It(this.extent_, t.getExtent())) {
      if (this.strokeState_ || this.fillState_) {
        this.fillState_ && this.setContextFillState_(this.fillState_), this.strokeState_ && this.setContextStrokeState_(this.strokeState_);
        const e = this.context_, i = t.getOrientedFlatCoordinates();
        let s = 0;
        const r = t.getEndss(), o = t.getStride();
        e.beginPath();
        for (let a = 0, l = r.length; a < l; ++a) {
          const c = r[a];
          s = this.drawRings_(i, s, c, o);
        }
        this.fillState_ && e.fill(), this.strokeState_ && e.stroke();
      }
      if (this.text_ !== "") {
        const e = t.getFlatInteriorPoints();
        this.drawText_(e, 0, e.length, 2);
      }
    }
  }
  /**
   * @param {import("../canvas.js").FillState} fillState Fill state.
   * @private
   */
  setContextFillState_(t) {
    const e = this.context_, i = this.contextFillState_;
    i ? i.fillStyle != t.fillStyle && (i.fillStyle = t.fillStyle, e.fillStyle = t.fillStyle) : (e.fillStyle = t.fillStyle, this.contextFillState_ = {
      fillStyle: t.fillStyle
    });
  }
  /**
   * @param {import("../canvas.js").StrokeState} strokeState Stroke state.
   * @private
   */
  setContextStrokeState_(t) {
    const e = this.context_, i = this.contextStrokeState_;
    i ? (i.lineCap != t.lineCap && (i.lineCap = t.lineCap, e.lineCap = t.lineCap), Pe(i.lineDash, t.lineDash) || e.setLineDash(
      i.lineDash = t.lineDash
    ), i.lineDashOffset != t.lineDashOffset && (i.lineDashOffset = t.lineDashOffset, e.lineDashOffset = t.lineDashOffset), i.lineJoin != t.lineJoin && (i.lineJoin = t.lineJoin, e.lineJoin = t.lineJoin), i.lineWidth != t.lineWidth && (i.lineWidth = t.lineWidth, e.lineWidth = t.lineWidth), i.miterLimit != t.miterLimit && (i.miterLimit = t.miterLimit, e.miterLimit = t.miterLimit), i.strokeStyle != t.strokeStyle && (i.strokeStyle = t.strokeStyle, e.strokeStyle = t.strokeStyle)) : (e.lineCap = t.lineCap, e.setLineDash(t.lineDash), e.lineDashOffset = t.lineDashOffset, e.lineJoin = t.lineJoin, e.lineWidth = t.lineWidth, e.miterLimit = t.miterLimit, e.strokeStyle = t.strokeStyle, this.contextStrokeState_ = {
      lineCap: t.lineCap,
      lineDash: t.lineDash,
      lineDashOffset: t.lineDashOffset,
      lineJoin: t.lineJoin,
      lineWidth: t.lineWidth,
      miterLimit: t.miterLimit,
      strokeStyle: t.strokeStyle
    });
  }
  /**
   * @param {import("../canvas.js").TextState} textState Text state.
   * @private
   */
  setContextTextState_(t) {
    const e = this.context_, i = this.contextTextState_, s = t.textAlign ? t.textAlign : an;
    i ? (i.font != t.font && (i.font = t.font, e.font = t.font), i.textAlign != s && (i.textAlign = s, e.textAlign = s), i.textBaseline != t.textBaseline && (i.textBaseline = t.textBaseline, e.textBaseline = t.textBaseline)) : (e.font = t.font, e.textAlign = s, e.textBaseline = t.textBaseline, this.contextTextState_ = {
      font: t.font,
      textAlign: s,
      textBaseline: t.textBaseline
    });
  }
  /**
   * Set the fill and stroke style for subsequent draw operations.  To clear
   * either fill or stroke styles, pass null for the appropriate parameter.
   *
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @override
   */
  setFillStrokeStyle(t, e) {
    if (!t)
      this.fillState_ = null;
    else {
      const i = t.getColor();
      this.fillState_ = {
        fillStyle: ne(
          i || Tt
        )
      };
    }
    if (!e)
      this.strokeState_ = null;
    else {
      const i = e.getColor(), s = e.getLineCap(), r = e.getLineDash(), o = e.getLineDashOffset(), a = e.getLineJoin(), l = e.getWidth(), c = e.getMiterLimit(), h = r || _e;
      this.strokeState_ = {
        lineCap: s !== void 0 ? s : Ii,
        lineDash: this.pixelRatio_ === 1 ? h : h.map((u) => u * this.pixelRatio_),
        lineDashOffset: (o || me) * this.pixelRatio_,
        lineJoin: a !== void 0 ? a : vi,
        lineWidth: (l !== void 0 ? l : ln) * this.pixelRatio_,
        miterLimit: c !== void 0 ? c : rn,
        strokeStyle: ne(
          i || on
        )
      };
    }
  }
  /**
   * Set the image style for subsequent draw operations.  Pass null to remove
   * the image style.
   *
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   * @override
   */
  setImageStyle(t) {
    let e;
    if (!t || !(e = t.getSize())) {
      this.image_ = null;
      return;
    }
    const i = t.getPixelRatio(this.pixelRatio_), s = t.getAnchor(), r = t.getOrigin();
    this.image_ = t.getImage(this.pixelRatio_), this.imageAnchorX_ = s[0] * i, this.imageAnchorY_ = s[1] * i, this.imageHeight_ = e[1] * i, this.imageOpacity_ = t.getOpacity(), this.imageOriginX_ = r[0], this.imageOriginY_ = r[1], this.imageRotateWithView_ = t.getRotateWithView(), this.imageRotation_ = t.getRotation();
    const o = t.getScaleArray();
    this.imageScale_ = [
      o[0] * this.pixelRatio_ / i,
      o[1] * this.pixelRatio_ / i
    ], this.imageWidth_ = e[0] * i;
  }
  /**
   * Set the text style for subsequent draw operations.  Pass null to
   * remove the text style.
   *
   * @param {import("../../style/Text.js").default} textStyle Text style.
   * @override
   */
  setTextStyle(t) {
    if (!t)
      this.text_ = "";
    else {
      const e = t.getFill();
      if (!e)
        this.textFillState_ = null;
      else {
        const f = e.getColor();
        this.textFillState_ = {
          fillStyle: ne(
            f || Tt
          )
        };
      }
      const i = t.getStroke();
      if (!i)
        this.textStrokeState_ = null;
      else {
        const f = i.getColor(), g = i.getLineCap(), m = i.getLineDash(), _ = i.getLineDashOffset(), p = i.getLineJoin(), E = i.getWidth(), w = i.getMiterLimit();
        this.textStrokeState_ = {
          lineCap: g !== void 0 ? g : Ii,
          lineDash: m || _e,
          lineDashOffset: _ || me,
          lineJoin: p !== void 0 ? p : vi,
          lineWidth: E !== void 0 ? E : ln,
          miterLimit: w !== void 0 ? w : rn,
          strokeStyle: ne(
            f || on
          )
        };
      }
      const s = t.getFont(), r = t.getOffsetX(), o = t.getOffsetY(), a = t.getRotateWithView(), l = t.getRotation(), c = t.getScaleArray(), h = t.getText(), u = t.getTextAlign(), d = t.getTextBaseline();
      this.textState_ = {
        font: s !== void 0 ? s : cl,
        textAlign: u !== void 0 ? u : an,
        textBaseline: d !== void 0 ? d : Un
      }, this.text_ = h !== void 0 ? Array.isArray(h) ? h.reduce((f, g, m) => f += m % 2 ? " " : g, "") : h : "", this.textOffsetX_ = r !== void 0 ? this.pixelRatio_ * r : 0, this.textOffsetY_ = o !== void 0 ? this.pixelRatio_ * o : 0, this.textRotateWithView_ = a !== void 0 ? a : !1, this.textRotation_ = l !== void 0 ? l : 0, this.textScale_ = [
        this.pixelRatio_ * c[0],
        this.pixelRatio_ * c[1]
      ];
    }
  }
}
const ie = 0.5;
function ef(n, t, e, i, s, r, o, a, l) {
  const c = s, h = n[0] * ie, u = n[1] * ie, d = at(h, u);
  d.imageSmoothingEnabled = !1;
  const f = d.canvas, g = new tf(
    d,
    ie,
    s,
    null,
    o,
    a,
    null
  ), m = e.length, _ = Math.floor((256 * 256 * 256 - 1) / m), p = {};
  for (let w = 1; w <= m; ++w) {
    const y = e[w - 1], x = y.getStyleFunction() || i;
    if (!x)
      continue;
    let R = x(y, r);
    if (!R)
      continue;
    Array.isArray(R) || (R = [R]);
    const S = (w * _).toString(16).padStart(7, "#00000");
    for (let v = 0, L = R.length; v < L; ++v) {
      const k = R[v], b = k.getGeometryFunction()(y);
      if (!b || !It(c, b.getExtent()))
        continue;
      const A = k.clone(), M = A.getFill();
      M && M.setColor(S);
      const Y = A.getStroke();
      Y && (Y.setColor(S), Y.setLineDash(null)), A.setText(void 0);
      const F = k.getImage();
      if (F) {
        const V = F.getImageSize();
        if (!V)
          continue;
        const Q = at(
          V[0],
          V[1],
          void 0,
          { alpha: !1 }
        ), I = Q.canvas;
        Q.fillStyle = S, Q.fillRect(0, 0, I.width, I.height), A.setImage(
          new Pi({
            img: I,
            anchor: F.getAnchor(),
            anchorXUnits: "pixels",
            anchorYUnits: "pixels",
            offset: F.getOrigin(),
            opacity: 1,
            size: F.getSize(),
            scale: F.getScale(),
            rotation: F.getRotation(),
            rotateWithView: F.getRotateWithView()
          })
        );
      }
      const G = A.getZIndex() || 0;
      let D = p[G];
      D || (D = {}, p[G] = D, D.Polygon = [], D.Circle = [], D.LineString = [], D.Point = []);
      const K = b.getType();
      if (K === "GeometryCollection") {
        const V = (
          /** @type {import("../../geom/GeometryCollection.js").default} */
          b.getGeometriesArrayRecursive()
        );
        for (let Q = 0, I = V.length; Q < I; ++Q) {
          const _t = V[Q];
          D[_t.getType().replace("Multi", "")].push(
            _t,
            A
          );
        }
      } else
        D[K.replace("Multi", "")].push(b, A);
    }
  }
  const E = Object.keys(p).map(Number).sort(ge);
  for (let w = 0, y = E.length; w < y; ++w) {
    const x = p[E[w]];
    for (const R in x) {
      const T = x[R];
      for (let S = 0, v = T.length; S < v; S += 2) {
        g.setStyle(T[S + 1]);
        for (let L = 0, k = t.length; L < k; ++L)
          g.setTransform(t[L]), g.drawGeometry(T[S]);
      }
    }
  }
  return d.getImageData(0, 0, f.width, f.height);
}
function nf(n, t, e) {
  const i = [];
  if (e) {
    const s = Math.floor(Math.round(n[0]) * ie), r = Math.floor(Math.round(n[1]) * ie), o = (it(s, 0, e.width - 1) + it(r, 0, e.height - 1) * e.width) * 4, a = e.data[o], l = e.data[o + 1], h = e.data[o + 2] + 256 * (l + 256 * a), u = Math.floor((256 * 256 * 256 - 1) / t.length);
    h && h % u === 0 && i.push(t[h / u - 1]);
  }
  return i;
}
const sf = 0.5, vl = {
  Point: df,
  LineString: hf,
  Polygon: gf,
  MultiPoint: ff,
  MultiLineString: cf,
  MultiPolygon: uf,
  GeometryCollection: lf,
  Circle: of
};
function rf(n, t) {
  return parseInt(B(n), 10) - parseInt(B(t), 10);
}
function sa(n, t) {
  const e = Ll(n, t);
  return e * e;
}
function Ll(n, t) {
  return sf * n / t;
}
function of(n, t, e, i, s) {
  const r = e.getFill(), o = e.getStroke();
  if (r || o) {
    const l = n.getBuilder(e.getZIndex(), "Circle");
    l.setFillStrokeStyle(r, o), l.drawCircle(t, i, s);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = n.getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i);
  }
}
function ra(n, t, e, i, s, r, o, a) {
  const l = [], c = e.getImage();
  if (c) {
    let d = !0;
    const f = c.getImageState();
    f == X.LOADED || f == X.ERROR ? d = !1 : f == X.IDLE && c.load(), d && l.push(c.ready());
  }
  const h = e.getFill();
  h && h.loading() && l.push(h.ready());
  const u = l.length > 0;
  return u && Promise.all(l).then(() => s(null)), af(
    n,
    t,
    e,
    i,
    r,
    o,
    a
  ), u;
}
function af(n, t, e, i, s, r, o) {
  const a = e.getGeometryFunction()(t);
  if (!a)
    return;
  const l = a.simplifyTransformed(
    i,
    s
  );
  if (e.getRenderer())
    Al(n, l, e, t, o);
  else {
    const h = vl[l.getType()];
    h(
      n,
      l,
      e,
      t,
      o,
      r
    );
  }
}
function Al(n, t, e, i, s) {
  if (t.getType() == "GeometryCollection") {
    const o = (
      /** @type {import("../geom/GeometryCollection.js").default} */
      t.getGeometries()
    );
    for (let a = 0, l = o.length; a < l; ++a)
      Al(n, o[a], e, i, s);
    return;
  }
  n.getBuilder(e.getZIndex(), "Default").drawCustom(
    /** @type {import("../geom/SimpleGeometry.js").default} */
    t,
    i,
    e.getRenderer(),
    e.getHitDetectionRenderer(),
    s
  );
}
function lf(n, t, e, i, s, r) {
  const o = t.getGeometriesArray();
  let a, l;
  for (a = 0, l = o.length; a < l; ++a) {
    const c = vl[o[a].getType()];
    c(
      n,
      o[a],
      e,
      i,
      s,
      r
    );
  }
}
function hf(n, t, e, i, s) {
  const r = e.getStroke();
  if (r) {
    const a = n.getBuilder(
      e.getZIndex(),
      "LineString"
    );
    a.setFillStrokeStyle(null, r), a.drawLineString(t, i, s);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = n.getBuilder(e.getZIndex(), "Text");
    a.setTextStyle(o), a.drawText(t, i, s);
  }
}
function cf(n, t, e, i, s) {
  const r = e.getStroke();
  if (r) {
    const a = n.getBuilder(
      e.getZIndex(),
      "LineString"
    );
    a.setFillStrokeStyle(null, r), a.drawMultiLineString(t, i, s);
  }
  const o = e.getText();
  if (o && o.getText()) {
    const a = n.getBuilder(e.getZIndex(), "Text");
    a.setTextStyle(o), a.drawText(t, i, s);
  }
}
function uf(n, t, e, i, s) {
  const r = e.getFill(), o = e.getStroke();
  if (o || r) {
    const l = n.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(r, o), l.drawMultiPolygon(t, i, s);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = n.getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i, s);
  }
}
function df(n, t, e, i, s, r) {
  const o = e.getImage(), a = e.getText(), l = a && a.getText(), c = r && o && l ? {} : void 0;
  if (o) {
    if (o.getImageState() != X.LOADED)
      return;
    const h = n.getBuilder(e.getZIndex(), "Image");
    h.setImageStyle(o, c), h.drawPoint(t, i, s);
  }
  if (l) {
    const h = n.getBuilder(e.getZIndex(), "Text");
    h.setTextStyle(a, c), h.drawText(t, i, s);
  }
}
function ff(n, t, e, i, s, r) {
  const o = e.getImage(), a = o && o.getOpacity() !== 0, l = e.getText(), c = l && l.getText(), h = r && a && c ? {} : void 0;
  if (a) {
    if (o.getImageState() != X.LOADED)
      return;
    const u = n.getBuilder(e.getZIndex(), "Image");
    u.setImageStyle(o, h), u.drawMultiPoint(t, i, s);
  }
  if (c) {
    const u = n.getBuilder(e.getZIndex(), "Text");
    u.setTextStyle(l, h), u.drawText(t, i, s);
  }
}
function gf(n, t, e, i, s) {
  const r = e.getFill(), o = e.getStroke();
  if (r || o) {
    const l = n.getBuilder(e.getZIndex(), "Polygon");
    l.setFillStrokeStyle(r, o), l.drawPolygon(t, i, s);
  }
  const a = e.getText();
  if (a && a.getText()) {
    const l = n.getBuilder(e.getZIndex(), "Text");
    l.setTextStyle(a), l.drawText(t, i, s);
  }
}
class _f extends Sl {
  /**
   * @param {import("../../layer/BaseVector.js").default} vectorLayer Vector layer.
   */
  constructor(t) {
    super(t), this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this), this.animatingOrInteracting_, this.hitDetectionImageData_ = null, this.clipped_ = !1, this.renderedFeatures_ = null, this.renderedRevision_ = -1, this.renderedResolution_ = NaN, this.renderedExtent_ = Yt(), this.wrappedRenderedExtent_ = Yt(), this.renderedRotation_, this.renderedCenter_ = null, this.renderedProjection_ = null, this.renderedPixelRatio_ = 1, this.renderedRenderOrder_ = null, this.renderedFrameDeclutter_, this.replayGroup_ = null, this.replayGroupChanged = !0, this.clipping = !0, this.targetContext_ = null, this.opacity_ = 1;
  }
  /**
   * @param {ExecutorGroup} executorGroup Executor group.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {boolean} [declutterable] `true` to only render declutterable items,
   *     `false` to only render non-declutterable items, `undefined` to render all.
   */
  renderWorlds(t, e, i) {
    const s = e.extent, r = e.viewState, o = r.center, a = r.resolution, l = r.projection, c = r.rotation, h = l.getExtent(), u = this.getLayer().getSource(), d = this.getLayer().getDeclutter(), f = e.pixelRatio, g = e.viewHints, m = !(g[Et.ANIMATING] || g[Et.INTERACTING]), _ = this.context, p = Math.round(J(s) / a * f), E = Math.round(Rt(s) / a * f), w = u.getWrapX() && l.canWrapX(), y = w ? J(h) : null, x = w ? Math.ceil((s[2] - h[2]) / y) + 1 : 1;
    let R = w ? Math.floor((s[0] - h[0]) / y) : 0;
    do {
      let T = this.getRenderTransform(
        o,
        a,
        0,
        f,
        p,
        E,
        R * y
      );
      e.declutter && (T = T.slice(0)), t.execute(
        _,
        [_.canvas.width, _.canvas.height],
        T,
        c,
        m,
        i === void 0 ? mi : i ? Il : qd,
        i ? d && e.declutter[d] : void 0
      );
    } while (++R < x);
  }
  /**
   * @private
   */
  setDrawContext_() {
    this.opacity_ !== 1 && (this.targetContext_ = this.context, this.context = at(
      this.context.canvas.width,
      this.context.canvas.height,
      Jo
    ));
  }
  /**
   * @private
   */
  resetDrawContext_() {
    if (this.opacity_ !== 1) {
      const t = this.targetContext_.globalAlpha;
      this.targetContext_.globalAlpha = this.opacity_, this.targetContext_.drawImage(this.context.canvas, 0, 0), this.targetContext_.globalAlpha = t, fs(this.context), Jo.push(this.context.canvas), this.context = this.targetContext_, this.targetContext_ = null;
    }
  }
  /**
   * Render declutter items for this layer
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   */
  renderDeclutter(t) {
    !this.replayGroup_ || !this.getLayer().getDeclutter() || this.renderWorlds(this.replayGroup_, t, !0);
  }
  /**
   * Render deferred instructions.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @override
   */
  renderDeferredInternal(t) {
    this.replayGroup_ && (this.replayGroup_.renderDeferred(), this.clipped_ && this.context.restore(), this.resetDrawContext_());
  }
  /**
   * Render the layer.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {HTMLElement|null} target Target that may be used to render content to.
   * @return {HTMLElement} The rendered element.
   * @override
   */
  renderFrame(t, e) {
    const i = t.layerStatesArray[t.layerIndex];
    this.opacity_ = i.opacity;
    const s = t.viewState;
    this.prepareContainer(t, e);
    const r = this.context, o = this.replayGroup_;
    let a = o && !o.isEmpty();
    if (!a && !(this.getLayer().hasListener(Gt.PRERENDER) || this.getLayer().hasListener(Gt.POSTRENDER)))
      return this.container;
    if (this.setDrawContext_(), this.preRender(r, t), s.projection, this.clipped_ = !1, a && i.extent && this.clipping) {
      const l = ve(i.extent);
      a = It(l, t.extent), this.clipped_ = a && !fi(l, t.extent), this.clipped_ && this.clipUnrotated(r, t, l);
    }
    return a && this.renderWorlds(
      o,
      t,
      this.getLayer().getDeclutter() ? !1 : void 0
    ), !t.declutter && this.clipped_ && r.restore(), this.postRender(r, t), this.renderedRotation_ !== s.rotation && (this.renderedRotation_ = s.rotation, this.hitDetectionImageData_ = null), t.declutter || this.resetDrawContext_(), this.container;
  }
  /**
   * Asynchronous layer level hit detection.
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @return {Promise<Array<import("../../Feature").default>>} Promise
   * that resolves with an array of features.
   * @override
   */
  getFeatures(t) {
    return new Promise((e) => {
      if (this.frameState && !this.hitDetectionImageData_ && !this.animatingOrInteracting_) {
        const i = this.frameState.size.slice(), s = this.renderedCenter_, r = this.renderedResolution_, o = this.renderedRotation_, a = this.renderedProjection_, l = this.wrappedRenderedExtent_, c = this.getLayer(), h = [], u = i[0] * ie, d = i[1] * ie;
        h.push(
          this.getRenderTransform(
            s,
            r,
            o,
            ie,
            u,
            d,
            0
          ).slice()
        );
        const f = c.getSource(), g = a.getExtent();
        if (f.getWrapX() && a.canWrapX() && !fi(g, l)) {
          let m = l[0];
          const _ = J(g);
          let p = 0, E;
          for (; m < g[0]; )
            --p, E = _ * p, h.push(
              this.getRenderTransform(
                s,
                r,
                o,
                ie,
                u,
                d,
                E
              ).slice()
            ), m += _;
          for (p = 0, m = l[2]; m > g[2]; )
            ++p, E = _ * p, h.push(
              this.getRenderTransform(
                s,
                r,
                o,
                ie,
                u,
                d,
                E
              ).slice()
            ), m -= _;
        }
        this.hitDetectionImageData_ = ef(
          i,
          h,
          this.renderedFeatures_,
          c.getStyleFunction(),
          l,
          r,
          o,
          sa(r, this.renderedPixelRatio_)
        );
      }
      e(
        nf(t, this.renderedFeatures_, this.hitDetectionImageData_)
      );
    });
  }
  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {import("../vector.js").FeatureCallback<T>} callback Feature callback.
   * @param {Array<import("../Map.js").HitMatch<T>>} matches The hit detected matches with tolerance.
   * @return {T|undefined} Callback result.
   * @template T
   * @override
   */
  forEachFeatureAtCoordinate(t, e, i, s, r) {
    if (!this.replayGroup_)
      return;
    const o = e.viewState.resolution, a = e.viewState.rotation, l = this.getLayer(), c = {}, h = function(d, f, g) {
      const m = B(d), _ = c[m];
      if (_) {
        if (_ !== !0 && g < _.distanceSq) {
          if (g === 0)
            return c[m] = !0, r.splice(r.lastIndexOf(_), 1), s(d, l, f);
          _.geometry = f, _.distanceSq = g;
        }
      } else {
        if (g === 0)
          return c[m] = !0, s(d, l, f);
        r.push(
          c[m] = {
            feature: d,
            layer: l,
            geometry: f,
            distanceSq: g,
            callback: s
          }
        );
      }
    }, u = this.getLayer().getDeclutter();
    return this.replayGroup_.forEachFeatureAtCoordinate(
      t,
      o,
      a,
      i,
      h,
      u ? e.declutter?.[u]?.all().map((d) => d.value) : null
    );
  }
  /**
   * Perform action necessary to get the layer rendered after new fonts have loaded
   * @override
   */
  handleFontsChanged() {
    const t = this.getLayer();
    t.getVisible() && this.replayGroup_ && t.changed();
  }
  /**
   * Handle changes in image style state.
   * @param {import("../../events/Event.js").default} event Image style change event.
   * @private
   */
  handleStyleImageChange_(t) {
    this.renderIfReadyAndVisible();
  }
  /**
   * Determine whether render should be called.
   * @param {import("../../Map.js").FrameState} frameState Frame state.
   * @return {boolean} Layer is ready to be rendered.
   * @override
   */
  prepareFrame(t) {
    const e = this.getLayer(), i = e.getSource();
    if (!i)
      return !1;
    const s = t.viewHints[Et.ANIMATING], r = t.viewHints[Et.INTERACTING], o = e.getUpdateWhileAnimating(), a = e.getUpdateWhileInteracting();
    if (this.ready && !o && s || !a && r)
      return this.animatingOrInteracting_ = !0, !0;
    this.animatingOrInteracting_ = !1;
    const l = t.extent, c = t.viewState, h = c.projection, u = c.resolution, d = t.pixelRatio, f = e.getRevision(), g = e.getRenderBuffer();
    let m = e.getRenderOrder();
    m === void 0 && (m = rf);
    const _ = c.center.slice(), p = mr(
      l,
      g * u
    ), E = p.slice(), w = [p.slice()], y = h.getExtent();
    if (i.getWrapX() && h.canWrapX() && !fi(y, t.extent)) {
      const M = J(y), Y = Math.max(J(p) / 2, M);
      p[0] = y[0] - Y, p[2] = y[2] + Y, va(_, h);
      const F = Ta(w[0], h);
      F[0] < y[0] && F[2] < y[2] ? w.push([
        F[0] + M,
        F[1],
        F[2] + M,
        F[3]
      ]) : F[0] > y[0] && F[2] > y[2] && w.push([
        F[0] - M,
        F[1],
        F[2] - M,
        F[3]
      ]);
    }
    if (this.ready && this.renderedResolution_ == u && this.renderedRevision_ == f && this.renderedRenderOrder_ == m && this.renderedFrameDeclutter_ === !!t.declutter && fi(this.wrappedRenderedExtent_, p))
      return Pe(this.renderedExtent_, E) || (this.hitDetectionImageData_ = null, this.renderedExtent_ = E), this.renderedCenter_ = _, this.replayGroupChanged = !1, !0;
    this.replayGroup_ = null;
    const x = new Vd(
      Ll(u, d),
      p,
      u,
      d
    );
    let R;
    for (let M = 0, Y = w.length; M < Y; ++M)
      i.loadFeatures(w[M], u, h);
    const T = sa(u, d);
    let S = !0;
    const v = (
      /**
       * @param {import("../../Feature.js").default} feature Feature.
       * @param {number} index Index.
       */
      (M, Y) => {
        let F;
        const G = M.getStyleFunction() || e.getStyleFunction();
        if (G && (F = G(M, u)), F) {
          const D = this.renderFeature(
            M,
            T,
            F,
            x,
            R,
            this.getLayer().getDeclutter(),
            Y
          );
          S = S && !D;
        }
      }
    ), L = Na(p), k = i.getFeaturesInExtent(L);
    m && k.sort(m);
    for (let M = 0, Y = k.length; M < Y; ++M)
      v(k[M], M);
    this.renderedFeatures_ = k, this.ready = S;
    const b = x.finish(), A = new Jd(
      p,
      u,
      d,
      i.getOverlaps(),
      b,
      e.getRenderBuffer(),
      !!t.declutter
    );
    return this.renderedResolution_ = u, this.renderedRevision_ = f, this.renderedRenderOrder_ = m, this.renderedFrameDeclutter_ = !!t.declutter, this.renderedExtent_ = E, this.wrappedRenderedExtent_ = p, this.renderedCenter_ = _, this.renderedProjection_ = h, this.renderedPixelRatio_ = d, this.replayGroup_ = A, this.hitDetectionImageData_ = null, this.replayGroupChanged = !0, !0;
  }
  /**
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {number} squaredTolerance Squared render tolerance.
   * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
   * @param {import("../../render/canvas/BuilderGroup.js").default} builderGroup Builder group.
   * @param {import("../../proj.js").TransformFunction} [transform] Transform from user to view projection.
   * @param {boolean} [declutter] Enable decluttering.
   * @param {number} [index] Render order index.
   * @return {boolean} `true` if an image is loading.
   */
  renderFeature(t, e, i, s, r, o, a) {
    if (!i)
      return !1;
    let l = !1;
    if (Array.isArray(i))
      for (let c = 0, h = i.length; c < h; ++c)
        l = ra(
          s,
          t,
          i[c],
          e,
          this.boundHandleStyleImageChange_,
          r,
          o,
          a
        ) || l;
    else
      l = ra(
        s,
        t,
        i,
        e,
        this.boundHandleStyleImageChange_,
        r,
        o,
        a
      );
    return l;
  }
}
class $i extends pl {
  /**
   * @param {Options<VectorSourceType, FeatureType>} [options] Options.
   */
  constructor(t) {
    super(t);
  }
  /**
   * @override
   */
  createRenderer() {
    return new _f(this);
  }
}
const li = [0, 0, 0], Re = 5;
class Ml {
  /**
   * @param {Options} options Tile grid options.
   */
  constructor(t) {
    this.minZoom = t.minZoom !== void 0 ? t.minZoom : 0, this.resolutions_ = t.resolutions, $(
      Zl(
        this.resolutions_,
        /**
         * @param {number} a First resolution
         * @param {number} b Second resolution
         * @return {number} Comparison result
         */
        (s, r) => r - s
      ),
      "`resolutions` must be sorted in descending order"
    );
    let e;
    if (!t.origins) {
      for (let s = 0, r = this.resolutions_.length - 1; s < r; ++s)
        if (!e)
          e = this.resolutions_[s] / this.resolutions_[s + 1];
        else if (this.resolutions_[s] / this.resolutions_[s + 1] !== e) {
          e = void 0;
          break;
        }
    }
    this.zoomFactor_ = e, this.maxZoom = this.resolutions_.length - 1, this.origin_ = t.origin !== void 0 ? t.origin : null, this.origins_ = null, t.origins !== void 0 && (this.origins_ = t.origins, $(
      this.origins_.length == this.resolutions_.length,
      "Number of `origins` and `resolutions` must be equal"
    ));
    const i = t.extent;
    i !== void 0 && !this.origin_ && !this.origins_ && (this.origin_ = $e(i)), $(
      !this.origin_ && this.origins_ || this.origin_ && !this.origins_,
      "Either `origin` or `origins` must be configured, never both"
    ), this.tileSizes_ = null, t.tileSizes !== void 0 && (this.tileSizes_ = t.tileSizes, $(
      this.tileSizes_.length == this.resolutions_.length,
      "Number of `tileSizes` and `resolutions` must be equal"
    )), this.tileSize_ = t.tileSize !== void 0 ? t.tileSize : this.tileSizes_ ? null : Dr, $(
      !this.tileSize_ && this.tileSizes_ || this.tileSize_ && !this.tileSizes_,
      "Either `tileSize` or `tileSizes` must be configured, never both"
    ), this.extent_ = i !== void 0 ? i : null, this.fullTileRanges_ = null, this.tmpSize_ = [0, 0], this.tmpExtent_ = [0, 0, 0, 0], t.sizes !== void 0 ? this.fullTileRanges_ = t.sizes.map((s, r) => {
      const o = new Ur(
        Math.min(0, s[0]),
        Math.max(s[0] - 1, -1),
        Math.min(0, s[1]),
        Math.max(s[1] - 1, -1)
      );
      if (i) {
        const a = this.getTileRangeForExtentAndZ(i, r);
        o.minX = Math.max(a.minX, o.minX), o.maxX = Math.min(a.maxX, o.maxX), o.minY = Math.max(a.minY, o.minY), o.maxY = Math.min(a.maxY, o.maxY);
      }
      return o;
    }) : i && this.calculateTileRanges_(i);
  }
  /**
   * Call a function with each tile coordinate for a given extent and zoom level.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} zoom Integer zoom level.
   * @param {function(import("../tilecoord.js").TileCoord): void} callback Function called with each tile coordinate.
   * @api
   */
  forEachTileCoord(t, e, i) {
    const s = this.getTileRangeForExtentAndZ(t, e);
    for (let r = s.minX, o = s.maxX; r <= o; ++r)
      for (let a = s.minY, l = s.maxY; a <= l; ++a)
        i([e, r, a]);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {function(number, import("../TileRange.js").default): boolean} callback Callback.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {boolean} Callback succeeded.
   */
  forEachTileCoordParentTileRange(t, e, i, s) {
    let r, o, a, l = null, c = t[0] - 1;
    for (this.zoomFactor_ === 2 ? (o = t[1], a = t[2]) : l = this.getTileCoordExtent(t, s); c >= this.minZoom; ) {
      if (o !== void 0 && a !== void 0 ? (o = Math.floor(o / 2), a = Math.floor(a / 2), r = oi(o, o, a, a, i)) : r = this.getTileRangeForExtentAndZ(
        l,
        c,
        i
      ), e(c, r))
        return !0;
      --c;
    }
    return !1;
  }
  /**
   * Get the extent for this tile grid, if it was configured.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_;
  }
  /**
   * Get the maximum zoom level for the grid.
   * @return {number} Max zoom.
   * @api
   */
  getMaxZoom() {
    return this.maxZoom;
  }
  /**
   * Get the minimum zoom level for the grid.
   * @return {number} Min zoom.
   * @api
   */
  getMinZoom() {
    return this.minZoom;
  }
  /**
   * Get the origin for the grid at the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {import("../coordinate.js").Coordinate} Origin.
   * @api
   */
  getOrigin(t) {
    return this.origin_ ? this.origin_ : this.origins_[t];
  }
  /**
   * Get the resolution for the given zoom level.
   * @param {number} z Integer zoom level.
   * @return {number} Resolution.
   * @api
   */
  getResolution(t) {
    return this.resolutions_[t];
  }
  /**
   * Get the list of resolutions for the tile grid.
   * @return {Array<number>} Resolutions.
   * @api
   */
  getResolutions() {
    return this.resolutions_;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary import("../extent.js").Extent object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileCoordChildTileRange(t, e, i) {
    if (t[0] < this.maxZoom) {
      if (this.zoomFactor_ === 2) {
        const r = t[1] * 2, o = t[2] * 2;
        return oi(
          r,
          r + 1,
          o,
          o + 1,
          e
        );
      }
      const s = this.getTileCoordExtent(
        t,
        i || this.tmpExtent_
      );
      return this.getTileRangeForExtentAndZ(
        s,
        t[0] + 1,
        e
      );
    }
    return null;
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary import("../TileRange.js").default object.
   * @return {import("../TileRange.js").default|null} Tile range.
   */
  getTileRangeForTileCoordAndZ(t, e, i) {
    if (e > this.maxZoom || e < this.minZoom)
      return null;
    const s = t[0], r = t[1], o = t[2];
    if (e === s)
      return oi(
        r,
        o,
        r,
        o,
        i
      );
    if (this.zoomFactor_) {
      const l = Math.pow(this.zoomFactor_, e - s), c = Math.floor(r * l), h = Math.floor(o * l);
      if (e < s)
        return oi(c, c, h, h, i);
      const u = Math.floor(l * (r + 1)) - 1, d = Math.floor(l * (o + 1)) - 1;
      return oi(c, u, h, d, i);
    }
    const a = this.getTileCoordExtent(t, this.tmpExtent_);
    return this.getTileRangeForExtentAndZ(a, e, i);
  }
  /**
   * Get a tile range for the given extent and integer zoom level.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} z Integer zoom level.
   * @param {import("../TileRange.js").default} [tempTileRange] Temporary tile range object.
   * @return {import("../TileRange.js").default} Tile range.
   */
  getTileRangeForExtentAndZ(t, e, i) {
    this.getTileCoordForXYAndZ_(t[0], t[3], e, !1, li);
    const s = li[1], r = li[2];
    this.getTileCoordForXYAndZ_(t[2], t[1], e, !0, li);
    const o = li[1], a = li[2];
    return oi(s, o, r, a, i);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {import("../coordinate.js").Coordinate} Tile center.
   */
  getTileCoordCenter(t) {
    const e = this.getOrigin(t[0]), i = this.getResolution(t[0]), s = Lt(this.getTileSize(t[0]), this.tmpSize_);
    return [
      e[0] + (t[1] + 0.5) * s[0] * i,
      e[1] - (t[2] + 0.5) * s[1] * i
    ];
  }
  /**
   * Get the extent of a tile coordinate.
   *
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../extent.js").Extent} [tempExtent] Temporary extent object.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getTileCoordExtent(t, e) {
    const i = this.getOrigin(t[0]), s = this.getResolution(t[0]), r = Lt(this.getTileSize(t[0]), this.tmpSize_), o = i[0] + t[1] * r[0] * s, a = i[1] - (t[2] + 1) * r[1] * s, l = o + r[0] * s, c = a + r[1] * s;
    return be(o, a, l, c, e);
  }
  /**
   * Get the tile coordinate for the given map coordinate and resolution.  This
   * method considers that coordinates that intersect tile boundaries should be
   * assigned the higher tile coordinate.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} resolution Resolution.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndResolution(t, e, i) {
    return this.getTileCoordForXYAndResolution_(
      t[0],
      t[1],
      e,
      !1,
      i
    );
  }
  /**
   * Note that this method should not be called for resolutions that correspond
   * to an integer zoom level.  Instead call the `getTileCoordForXYAndZ_` method.
   * @param {number} x X.
   * @param {number} y Y.
   * @param {number} resolution Resolution (for a non-integer zoom level).
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndResolution_(t, e, i, s, r) {
    const o = this.getZForResolution(i), a = i / this.getResolution(o), l = this.getOrigin(o), c = Lt(this.getTileSize(o), this.tmpSize_);
    let h = a * (t - l[0]) / i / c[0], u = a * (l[1] - e) / i / c[1];
    return s ? (h = Sn(h, Re) - 1, u = Sn(u, Re) - 1) : (h = Rn(h, Re), u = Rn(u, Re)), qn(o, h, u, r);
  }
  /**
   * Although there is repetition between this method and `getTileCoordForXYAndResolution_`,
   * they should have separate implementations.  This method is for integer zoom
   * levels.  The other method should only be called for resolutions corresponding
   * to non-integer zoom levels.
   * @param {number} x Map x coordinate.
   * @param {number} y Map y coordinate.
   * @param {number} z Integer zoom level.
   * @param {boolean} reverseIntersectionPolicy Instead of letting edge
   *     intersections go to the higher tile coordinate, let edge intersections
   *     go to the lower tile coordinate.
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Temporary import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @private
   */
  getTileCoordForXYAndZ_(t, e, i, s, r) {
    const o = this.getOrigin(i), a = this.getResolution(i), l = Lt(this.getTileSize(i), this.tmpSize_);
    let c = (t - o[0]) / a / l[0], h = (o[1] - e) / a / l[1];
    return s ? (c = Sn(c, Re) - 1, h = Sn(h, Re) - 1) : (c = Rn(c, Re), h = Rn(h, Re)), qn(i, c, h, r);
  }
  /**
   * Get a tile coordinate given a map coordinate and zoom level.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {number} z Integer zoom level, e.g. the result of a `getZForResolution()` method call
   * @param {import("../tilecoord.js").TileCoord} [opt_tileCoord] Destination import("../tilecoord.js").TileCoord object.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate.
   * @api
   */
  getTileCoordForCoordAndZ(t, e, i) {
    return this.getTileCoordForXYAndZ_(
      t[0],
      t[1],
      e,
      !1,
      i
    );
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @return {number} Tile resolution.
   */
  getTileCoordResolution(t) {
    return this.resolutions_[t[0]];
  }
  /**
   * Get the tile size for a zoom level. The type of the return value matches the
   * `tileSize` or `tileSizes` that the tile grid was configured with. To always
   * get an {@link import("../size.js").Size}, run the result through {@link module:ol/size.toSize}.
   * @param {number} z Z.
   * @return {number|import("../size.js").Size} Tile size.
   * @api
   */
  getTileSize(t) {
    return this.tileSize_ ? this.tileSize_ : this.tileSizes_[t];
  }
  /**
   * @param {number} z Zoom level.
   * @return {import("../TileRange.js").default|null} Extent tile range for the specified zoom level.
   */
  getFullTileRange(t) {
    return this.fullTileRanges_ ? this.fullTileRanges_[t] : this.extent_ ? this.getTileRangeForExtentAndZ(this.extent_, t) : null;
  }
  /**
   * @param {number} resolution Resolution.
   * @param {number|import("../array.js").NearestDirectionFunction} [opt_direction]
   *     If 0, the nearest resolution will be used.
   *     If 1, the nearest higher resolution (lower Z) will be used. If -1, the
   *     nearest lower resolution (higher Z) will be used. Default is 0.
   *     Use a {@link module:ol/array~NearestDirectionFunction} for more precise control.
   *
   * For example to change tile Z at the midpoint of zoom levels
   * ```js
   * function(value, high, low) {
   *   return value - low * Math.sqrt(high / low);
   * }
   * ```
   * @return {number} Z.
   * @api
   */
  getZForResolution(t, e) {
    const i = _r(
      this.resolutions_,
      t,
      e || 0
    );
    return it(i, this.minZoom, this.maxZoom);
  }
  /**
   * The tile with the provided tile coordinate intersects the given viewport.
   * @param {import('../tilecoord.js').TileCoord} tileCoord Tile coordinate.
   * @param {Array<number>} viewport Viewport as returned from {@link module:ol/extent.getRotatedViewport}.
   * @return {boolean} The tile with the provided tile coordinate intersects the given viewport.
   */
  tileCoordIntersectsViewport(t, e) {
    return Ua(
      e,
      0,
      e.length,
      2,
      this.getTileCoordExtent(t)
    );
  }
  /**
   * @param {!import("../extent.js").Extent} extent Extent for this tile grid.
   * @private
   */
  calculateTileRanges_(t) {
    const e = this.resolutions_.length, i = new Array(e);
    for (let s = this.minZoom; s < e; ++s)
      i[s] = this.getTileRangeForExtentAndZ(t, s);
    this.fullTileRanges_ = i;
  }
}
function bl(n) {
  let t = n.getDefaultTileGrid();
  return t || (t = Ef(n), n.setDefaultTileGrid(t)), t;
}
function mf(n, t, e) {
  const i = t[0], s = n.getTileCoordCenter(t), r = jr(e);
  if (!Ri(r, s)) {
    const o = J(r), a = Math.ceil(
      (r[0] - s[0]) / o
    );
    return s[0] += o * a, n.getTileCoordForCoordAndZ(s, i);
  }
  return t;
}
function pf(n, t, e, i) {
  i = i !== void 0 ? i : "top-left";
  const s = Pl(n, t, e);
  return new Ml({
    extent: n,
    origin: lh(n, i),
    resolutions: s,
    tileSize: e
  });
}
function yf(n) {
  const t = n || {}, e = t.extent || At("EPSG:3857").getExtent(), i = {
    extent: e,
    minZoom: t.minZoom,
    tileSize: t.tileSize,
    resolutions: Pl(
      e,
      t.maxZoom,
      t.tileSize,
      t.maxResolution
    )
  };
  return new Ml(i);
}
function Pl(n, t, e, i) {
  t = t !== void 0 ? t : xc, e = Lt(e !== void 0 ? e : Dr);
  const s = Rt(n), r = J(n);
  i = i > 0 ? i : Math.max(r / e[0], s / e[1]);
  const o = t + 1, a = new Array(o);
  for (let l = 0; l < o; ++l)
    a[l] = i / Math.pow(2, l);
  return a;
}
function Ef(n, t, e, i) {
  const s = jr(n);
  return pf(s, t, e, i);
}
function jr(n) {
  n = At(n);
  let t = n.getExtent();
  if (!t) {
    const e = 180 * Er.degrees / n.getMetersPerUnit();
    t = be(-e, -e, e, e);
  }
  return t;
}
const xf = /\{z\}/g, wf = /\{x\}/g, Cf = /\{y\}/g, Rf = /\{-y\}/g;
function Sf(n, t, e, i, s) {
  return n.replace(xf, t.toString()).replace(wf, e.toString()).replace(Cf, i.toString()).replace(Rf, function() {
    if (s === void 0)
      throw new Error(
        "If the URL template has a {-y} placeholder, the grid extent must be known"
      );
    return (s - i).toString();
  });
}
function Tf(n) {
  const t = [];
  let e = /\{([a-z])-([a-z])\}/.exec(n);
  if (e) {
    const i = e[1].charCodeAt(0), s = e[2].charCodeAt(0);
    let r;
    for (r = i; r <= s; ++r)
      t.push(n.replace(e[0], String.fromCharCode(r)));
    return t;
  }
  if (e = /\{(\d+)-(\d+)\}/.exec(n), e) {
    const i = parseInt(e[2], 10);
    for (let s = parseInt(e[1], 10); s <= i; s++)
      t.push(n.replace(e[0], s.toString()));
    return t;
  }
  return t.push(n), t;
}
function If(n, t) {
  return (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function(e, i, s) {
      if (!e)
        return;
      let r;
      const o = e[0];
      if (t) {
        const a = t.getFullTileRange(o);
        a && (r = a.getHeight() - 1);
      }
      return Sf(n, o, e[1], e[2], r);
    }
  );
}
function vf(n, t) {
  const e = n.length, i = new Array(e);
  for (let s = 0; s < e; ++s)
    i[s] = If(n[s], t);
  return Lf(i);
}
function Lf(n) {
  return n.length === 1 ? n[0] : (
    /**
     * @param {import("./tilecoord.js").TileCoord} tileCoord Tile Coordinate.
     * @param {number} pixelRatio Pixel ratio.
     * @param {import("./proj/Projection.js").default} projection Projection.
     * @return {string|undefined} Tile URL.
     */
    function(t, e, i) {
      if (!t)
        return;
      const s = Md(t), r = Be(s, n.length);
      return n[r](t, e, i);
    }
  );
}
class Ol extends $t {
  /**
   * @param {Options} options Source options.
   */
  constructor(t) {
    super(), this.projection = At(t.projection), this.attributions_ = oa(t.attributions), this.attributionsCollapsible_ = t.attributionsCollapsible ?? !0, this.loading = !1, this.state_ = t.state !== void 0 ? t.state : "ready", this.wrapX_ = t.wrapX !== void 0 ? t.wrapX : !1, this.interpolate_ = !!t.interpolate, this.viewResolver = null, this.viewRejector = null;
    const e = this;
    this.viewPromise_ = new Promise(function(i, s) {
      e.viewResolver = i, e.viewRejector = s;
    });
  }
  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   * @api
   */
  getAttributions() {
    return this.attributions_;
  }
  /**
   * @return {boolean} Attributions are collapsible.
   * @api
   */
  getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  }
  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default|null} Projection.
   * @api
   */
  getProjection() {
    return this.projection;
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   */
  getResolutions(t) {
    return null;
  }
  /**
   * @return {Promise<import("../View.js").ViewOptions>} A promise for view-related properties.
   */
  getView() {
    return this.viewPromise_;
  }
  /**
   * Get the state of the source, see {@link import("./Source.js").State} for possible states.
   * @return {import("./Source.js").State} State.
   * @api
   */
  getState() {
    return this.state_;
  }
  /**
   * @return {boolean|undefined} Wrap X.
   */
  getWrapX() {
    return this.wrapX_;
  }
  /**
   * @return {boolean} Use linear interpolation when resampling.
   */
  getInterpolate() {
    return this.interpolate_;
  }
  /**
   * Refreshes the source. The source will be cleared, and data from the server will be reloaded.
   * @api
   */
  refresh() {
    this.changed();
  }
  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, {@link module:ol/source/Source~Attribution},
   *     or `undefined`.
   * @api
   */
  setAttributions(t) {
    this.attributions_ = oa(t), this.changed();
  }
  /**
   * Set the state of the source.
   * @param {import("./Source.js").State} state State.
   */
  setState(t) {
    this.state_ = t, this.changed();
  }
}
function oa(n) {
  return n ? typeof n == "function" ? n : (Array.isArray(n) || (n = [n]), (t) => n) : null;
}
class Af extends Ol {
  /**
   * @param {Options} options SourceTile source options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      attributionsCollapsible: t.attributionsCollapsible,
      projection: t.projection,
      state: t.state,
      wrapX: t.wrapX,
      interpolate: t.interpolate
    }), this.on, this.once, this.un, this.tilePixelRatio_ = t.tilePixelRatio !== void 0 ? t.tilePixelRatio : 1, this.tileGrid = t.tileGrid !== void 0 ? t.tileGrid : null;
    const e = [256, 256];
    this.tileGrid && Lt(this.tileGrid.getTileSize(this.tileGrid.getMinZoom()), e), this.tmpSize = [0, 0], this.key_ = t.key || B(this), this.tileOptions = {
      transition: t.transition,
      interpolate: t.interpolate
    }, this.zDirection = t.zDirection ? t.zDirection : 0;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   */
  getGutterForProjection(t) {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   */
  getKey() {
    return this.key_;
  }
  /**
   * Set the value to be used as the key for all tiles in the source.
   * @param {string} key The key for tiles.
   * @protected
   */
  setKey(t) {
    this.key_ !== t && (this.key_ = t, this.changed());
  }
  /**
   * @param {import("../proj/Projection").default} [projection] Projection.
   * @return {Array<number>|null} Resolutions.
   * @override
   */
  getResolutions(t) {
    const e = t ? this.getTileGridForProjection(t) : this.tileGrid;
    return e ? e.getResolutions() : null;
  }
  /**
   * @abstract
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {TileType|null} Tile.
   */
  getTile(t, e, i, s, r) {
    return j();
  }
  /**
   * Return the tile grid of the tile source.
   * @return {import("../tilegrid/TileGrid.js").default|null} Tile grid.
   * @api
   */
  getTileGrid() {
    return this.tileGrid;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   */
  getTileGridForProjection(t) {
    return this.tileGrid ? this.tileGrid : bl(t);
  }
  /**
   * Get the tile pixel ratio for this source. Subclasses may override this
   * method, which is meant to return a supported pixel ratio that matches the
   * provided `pixelRatio` as close as possible.
   * @param {number} pixelRatio Pixel ratio.
   * @return {number} Tile pixel ratio.
   */
  getTilePixelRatio(t) {
    return this.tilePixelRatio_;
  }
  /**
   * @param {number} z Z.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../size.js").Size} Tile size.
   */
  getTilePixelSize(t, e, i) {
    const s = this.getTileGridForProjection(i), r = this.getTilePixelRatio(e), o = Lt(s.getTileSize(t), this.tmpSize);
    return r == 1 ? o : _u(o, r, this.tmpSize);
  }
  /**
   * Returns a tile coordinate wrapped around the x-axis. When the tile coordinate
   * is outside the resolution and extent range of the tile grid, `null` will be
   * returned.
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {import("../proj/Projection.js").default} [projection] Projection.
   * @return {import("../tilecoord.js").TileCoord} Tile coordinate to be passed to the tileUrlFunction or
   *     null if no tile URL should be created for the passed `tileCoord`.
   */
  getTileCoordForTileUrlFunction(t, e) {
    const i = e !== void 0 ? e : this.getProjection(), s = e !== void 0 ? this.getTileGridForProjection(i) : this.tileGrid || this.getTileGridForProjection(i);
    return this.getWrapX() && i.isGlobal() && (t = mf(s, t, i)), Pd(t, s) ? t : null;
  }
  /**
   * Remove all cached reprojected tiles from the source. The next render cycle will create new tiles.
   * @api
   */
  clear() {
  }
  /**
   * @override
   */
  refresh() {
    this.clear(), super.refresh();
  }
}
class Mf extends se {
  /**
   * @param {string} type Type.
   * @param {import("../Tile.js").default} tile The tile.
   */
  constructor(t, e) {
    super(t), this.tile = e;
  }
}
const $s = {
  /**
   * Triggered when a tile starts loading.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadstart
   * @api
   */
  TILELOADSTART: "tileloadstart",
  /**
   * Triggered when a tile finishes loading, either when its data is loaded,
   * or when loading was aborted because the tile is no longer needed.
   * @event module:ol/source/Tile.TileSourceEvent#tileloadend
   * @api
   */
  TILELOADEND: "tileloadend",
  /**
   * Triggered if tile loading results in an error. Note that this is not the
   * right place to re-fetch tiles. See {@link module:ol/ImageTile~ImageTile#load}
   * for details.
   * @event module:ol/source/Tile.TileSourceEvent#tileloaderror
   * @api
   */
  TILELOADERROR: "tileloaderror"
};
class Hr extends Af {
  /**
   * @param {Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tilePixelRatio: t.tilePixelRatio,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.generateTileUrlFunction_ = this.tileUrlFunction === Hr.prototype.tileUrlFunction, this.tileLoadFunction = t.tileLoadFunction, t.tileUrlFunction && (this.tileUrlFunction = t.tileUrlFunction), this.urls = null, t.urls ? this.setUrls(t.urls) : t.url && this.setUrl(t.url), this.tileLoadingKeys_ = {};
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the tile load function of the source.
   * @return {import("../Tile.js").LoadFunction} TileLoadFunction
   * @api
   */
  getTileLoadFunction() {
    return this.tileLoadFunction;
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the tile URL function of the source.
   * @return {import("../Tile.js").UrlFunction} TileUrlFunction
   * @api
   */
  getTileUrlFunction() {
    return Object.getPrototypeOf(this).tileUrlFunction === this.tileUrlFunction ? this.tileUrlFunction.bind(this) : this.tileUrlFunction;
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Return the URLs used for this source.
   * When a tileUrlFunction is used instead of url or urls,
   * null will be returned.
   * @return {!Array<string>|null} URLs.
   * @api
   */
  getUrls() {
    return this.urls;
  }
  /**
   * Handle tile change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  handleTileChange(t) {
    const e = (
      /** @type {import("../Tile.js").default} */
      t.target
    ), i = B(e), s = e.getState();
    let r;
    s == O.LOADING ? (this.tileLoadingKeys_[i] = !0, r = $s.TILELOADSTART) : i in this.tileLoadingKeys_ && (delete this.tileLoadingKeys_[i], r = s == O.ERROR ? $s.TILELOADERROR : s == O.LOADED ? $s.TILELOADEND : void 0), r != null && this.dispatchEvent(new Mf(r, e));
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the tile load function of the source.
   * @param {import("../Tile.js").LoadFunction} tileLoadFunction Tile load function.
   * @api
   */
  setTileLoadFunction(t) {
    this.tileLoadFunction = t, this.changed();
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the tile URL function of the source.
   * @param {import("../Tile.js").UrlFunction} tileUrlFunction Tile URL function.
   * @param {string} [key] Optional new tile key for the source.
   * @api
   */
  setTileUrlFunction(t, e) {
    this.tileUrlFunction = t, typeof e < "u" ? this.setKey(e) : this.changed();
  }
  /**
   * Set the URL to use for requests.
   * @param {string} url URL.
   * @api
   */
  setUrl(t) {
    const e = Tf(t);
    this.urls = e, this.setUrls(e);
  }
  /**
   * Deprecated.  Use an ImageTile source instead.
   * Set the URLs to use for requests.
   * @param {Array<string>} urls URLs.
   * @api
   */
  setUrls(t) {
    this.urls = t;
    const e = t.join(`
`);
    this.generateTileUrlFunction_ ? this.setTileUrlFunction(vf(t, this.tileGrid), e) : this.setKey(e);
  }
  /**
   * @param {import("../tilecoord.js").TileCoord} tileCoord Tile coordinate.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {string|undefined} Tile URL.
   */
  tileUrlFunction(t, e, i) {
  }
}
class bf extends Hr {
  /**
   * @param {!Options} options Image tile options.
   */
  constructor(t) {
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      projection: t.projection,
      state: t.state,
      tileGrid: t.tileGrid,
      tileLoadFunction: t.tileLoadFunction ? t.tileLoadFunction : Pf,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX,
      transition: t.transition,
      interpolate: t.interpolate !== void 0 ? t.interpolate : !0,
      key: t.key,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.crossOrigin = t.crossOrigin !== void 0 ? t.crossOrigin : null, this.tileClass = t.tileClass !== void 0 ? t.tileClass : wl, this.tileGridForProjection = {}, this.reprojectionErrorThreshold_ = t.reprojectionErrorThreshold, this.renderReprojectionEdges_ = !1;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {number} Gutter.
   * @override
   */
  getGutterForProjection(t) {
    return this.getProjection() && t && !Is(this.getProjection(), t) ? 0 : this.getGutter();
  }
  /**
   * @return {number} Gutter.
   */
  getGutter() {
    return 0;
  }
  /**
   * Return the key to be used for all tiles in the source.
   * @return {string} The key for all tiles.
   * @override
   */
  getKey() {
    let t = super.getKey();
    return this.getInterpolate() || (t += ":disable-interpolation"), t;
  }
  /**
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!import("../tilegrid/TileGrid.js").default} Tile grid.
   * @override
   */
  getTileGridForProjection(t) {
    const e = this.getProjection();
    if (this.tileGrid && (!e || Is(e, t)))
      return this.tileGrid;
    const i = B(t);
    return i in this.tileGridForProjection || (this.tileGridForProjection[i] = bl(t)), this.tileGridForProjection[i];
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {string} key The key set on the tile.
   * @return {!ImageTile} Tile.
   * @private
   */
  createTile_(t, e, i, s, r, o) {
    const a = [t, e, i], l = this.getTileCoordForTileUrlFunction(
      a,
      r
    ), c = l ? this.tileUrlFunction(l, s, r) : void 0, h = new this.tileClass(
      a,
      c !== void 0 ? O.IDLE : O.EMPTY,
      c !== void 0 ? c : "",
      this.crossOrigin,
      this.tileLoadFunction,
      this.tileOptions
    );
    return h.key = o, h.addEventListener(z.CHANGE, this.handleTileChange.bind(this)), h;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {!(ImageTile|ReprojTile)} Tile.
   * @override
   */
  getTile(t, e, i, s, r) {
    const o = this.getProjection();
    if (!o || !r || Is(o, r))
      return this.getTileInternal(
        t,
        e,
        i,
        s,
        o || r
      );
    const a = [t, e, i], l = this.getKey(), c = this.getTileGridForProjection(o), h = this.getTileGridForProjection(r), u = this.getTileCoordForTileUrlFunction(
      a,
      r
    ), d = new Cl(
      o,
      c,
      r,
      h,
      a,
      u,
      this.getTilePixelRatio(s),
      this.getGutter(),
      (f, g, m, _) => this.getTileInternal(f, g, m, _, o),
      this.reprojectionErrorThreshold_,
      this.renderReprojectionEdges_,
      this.tileOptions
    );
    return d.key = l, d;
  }
  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {!import("../proj/Projection.js").default} projection Projection.
   * @return {!ImageTile} Tile.
   * @protected
   */
  getTileInternal(t, e, i, s, r) {
    const o = this.getKey();
    return this.createTile_(t, e, i, s, r, o);
  }
  /**
   * Sets whether to render reprojection edges or not (usually for debugging).
   * @param {boolean} render Render the edges.
   * @api
   */
  setRenderReprojectionEdges(t) {
    this.renderReprojectionEdges_ != t && (this.renderReprojectionEdges_ = t, this.changed());
  }
  /**
   * Sets the tile grid to use when reprojecting the tiles to the given
   * projection instead of the default tile grid for the projection.
   *
   * This can be useful when the default tile grid cannot be created
   * (e.g. projection has no extent defined) or
   * for optimization reasons (custom tile size, resolutions, ...).
   *
   * @param {import("../proj.js").ProjectionLike} projection Projection.
   * @param {import("../tilegrid/TileGrid.js").default} tilegrid Tile grid to use for the projection.
   * @api
   */
  setTileGridForProjection(t, e) {
    const i = At(t);
    if (i) {
      const s = B(i);
      s in this.tileGridForProjection || (this.tileGridForProjection[s] = e);
    }
  }
}
function Pf(n, t) {
  n.getImage().src = t;
}
class Of extends bf {
  /**
   * @param {Options} [options] XYZ options.
   */
  constructor(t) {
    t = t || {};
    const e = t.projection !== void 0 ? t.projection : "EPSG:3857", i = t.tileGrid !== void 0 ? t.tileGrid : yf({
      extent: jr(e),
      maxResolution: t.maxResolution,
      maxZoom: t.maxZoom,
      minZoom: t.minZoom,
      tileSize: t.tileSize
    });
    super({
      attributions: t.attributions,
      cacheSize: t.cacheSize,
      crossOrigin: t.crossOrigin,
      interpolate: t.interpolate,
      projection: e,
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      tileGrid: i,
      tileLoadFunction: t.tileLoadFunction,
      tilePixelRatio: t.tilePixelRatio,
      tileUrlFunction: t.tileUrlFunction,
      url: t.url,
      urls: t.urls,
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0,
      transition: t.transition,
      attributionsCollapsible: t.attributionsCollapsible,
      zDirection: t.zDirection
    }), this.gutter_ = t.gutter !== void 0 ? t.gutter : 0;
  }
  /**
   * @return {number} Gutter.
   * @override
   */
  getGutter() {
    return this.gutter_;
  }
}
const Df = '&#169; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors.';
class qs extends Of {
  /**
   * @param {Options} [options] Open Street Map options.
   */
  constructor(t) {
    t = t || {};
    let e;
    t.attributions !== void 0 ? e = t.attributions : e = [Df];
    const i = t.crossOrigin !== void 0 ? t.crossOrigin : "anonymous", s = t.url !== void 0 ? t.url : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    super({
      attributions: e,
      attributionsCollapsible: !1,
      cacheSize: t.cacheSize,
      crossOrigin: i,
      interpolate: t.interpolate,
      maxZoom: t.maxZoom !== void 0 ? t.maxZoom : 19,
      reprojectionErrorThreshold: t.reprojectionErrorThreshold,
      tileLoadFunction: t.tileLoadFunction,
      transition: t.transition,
      url: s,
      wrapX: t.wrapX,
      zDirection: t.zDirection
    });
  }
}
class un extends $t {
  /**
   * @param {Geometry|ObjectWithGeometry<Geometry>} [geometryOrProperties]
   *     You may pass a Geometry object directly, or an object literal containing
   *     properties. If you pass an object literal, you may include a Geometry
   *     associated with a `geometry` key.
   */
  constructor(t) {
    if (super(), this.on, this.once, this.un, this.id_ = void 0, this.geometryName_ = "geometry", this.style_ = null, this.styleFunction_ = void 0, this.geometryChangeKey_ = null, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), t)
      if (typeof /** @type {?} */
      t.getSimplifiedGeometry == "function") {
        const e = (
          /** @type {Geometry} */
          t
        );
        this.setGeometry(e);
      } else {
        const e = t;
        this.setProperties(e);
      }
  }
  /**
   * Clone this feature. If the original feature has a geometry it
   * is also cloned. The feature id is not set in the clone.
   * @return {Feature<Geometry>} The clone.
   * @api
   */
  clone() {
    const t = (
      /** @type {Feature<Geometry>} */
      new un(this.hasProperties() ? this.getProperties() : null)
    );
    t.setGeometryName(this.getGeometryName());
    const e = this.getGeometry();
    e && t.setGeometry(
      /** @type {Geometry} */
      e.clone()
    );
    const i = this.getStyle();
    return i && t.setStyle(i), t;
  }
  /**
   * Get the feature's default geometry.  A feature may have any number of named
   * geometries.  The "default" geometry (the one that is rendered by default) is
   * set when calling {@link module:ol/Feature~Feature#setGeometry}.
   * @return {Geometry|undefined} The default geometry for the feature.
   * @api
   * @observable
   */
  getGeometry() {
    return (
      /** @type {Geometry|undefined} */
      this.get(this.geometryName_)
    );
  }
  /**
   * Get the feature identifier.  This is a stable identifier for the feature and
   * is either set when reading data from a remote source or set explicitly by
   * calling {@link module:ol/Feature~Feature#setId}.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id_;
  }
  /**
   * Get the name of the feature's default geometry.  By default, the default
   * geometry is named `geometry`.
   * @return {string} Get the property name associated with the default geometry
   *     for this feature.
   * @api
   */
  getGeometryName() {
    return this.geometryName_;
  }
  /**
   * Get the feature's style. Will return what was provided to the
   * {@link module:ol/Feature~Feature#setStyle} method.
   * @return {import("./style/Style.js").StyleLike|undefined} The feature style.
   * @api
   */
  getStyle() {
    return this.style_;
  }
  /**
   * Get the feature's style function.
   * @return {import("./style/Style.js").StyleFunction|undefined} Return a function
   * representing the current style of this feature.
   * @api
   */
  getStyleFunction() {
    return this.styleFunction_;
  }
  /**
   * @private
   */
  handleGeometryChange_() {
    this.changed();
  }
  /**
   * @private
   */
  handleGeometryChanged_() {
    this.geometryChangeKey_ && (tt(this.geometryChangeKey_), this.geometryChangeKey_ = null);
    const t = this.getGeometry();
    t && (this.geometryChangeKey_ = U(
      t,
      z.CHANGE,
      this.handleGeometryChange_,
      this
    )), this.changed();
  }
  /**
   * Set the default geometry for the feature.  This will update the property
   * with the name returned by {@link module:ol/Feature~Feature#getGeometryName}.
   * @param {Geometry|undefined} geometry The new geometry.
   * @api
   * @observable
   */
  setGeometry(t) {
    this.set(this.geometryName_, t);
  }
  /**
   * Set the style for the feature to override the layer style.  This can be a
   * single style object, an array of styles, or a function that takes a
   * resolution and returns an array of styles. To unset the feature style, call
   * `setStyle()` without arguments or a falsey value.
   * @param {import("./style/Style.js").StyleLike} [style] Style for this feature.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setStyle(t) {
    this.style_ = t, this.styleFunction_ = t ? Ff(t) : void 0, this.changed();
  }
  /**
   * Set the feature id.  The feature id is considered stable and may be used when
   * requesting features or comparing identifiers returned from a remote source.
   * The feature id can be used with the
   * {@link module:ol/source/Vector~VectorSource#getFeatureById} method.
   * @param {number|string|undefined} id The feature id.
   * @api
   * @fires module:ol/events/Event~BaseEvent#event:change
   */
  setId(t) {
    this.id_ = t, this.changed();
  }
  /**
   * Set the property name to be used when getting the feature's default geometry.
   * When calling {@link module:ol/Feature~Feature#getGeometry}, the value of the property with
   * this name will be returned.
   * @param {string} name The property name of the default geometry.
   * @api
   */
  setGeometryName(t) {
    this.removeChangeListener(this.geometryName_, this.handleGeometryChanged_), this.geometryName_ = t, this.addChangeListener(this.geometryName_, this.handleGeometryChanged_), this.handleGeometryChanged_();
  }
}
function Ff(n) {
  if (typeof n == "function")
    return n;
  let t;
  return Array.isArray(n) ? t = n : ($(
    typeof /** @type {?} */
    n.getZIndex == "function",
    "Expected an `ol/style/Style` or an array of `ol/style/Style.js`"
  ), t = [
    /** @type {import("./style/Style.js").default} */
    n
  ]), function() {
    return t;
  };
}
const kf = {
  /**
   * Triggered when feature(s) has been (de)selected.
   * @event SelectEvent#select
   * @api
   */
  SELECT: "select"
};
class Nf extends se {
  /**
   * @param {SelectEventType} type The event type.
   * @param {Array<import("../Feature.js").default>} selected Selected features.
   * @param {Array<import("../Feature.js").default>} deselected Deselected features.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Associated
   *     {@link module:ol/MapBrowserEvent~MapBrowserEvent}.
   */
  constructor(t, e, i, s) {
    super(t), this.selected = e, this.deselected = i, this.mapBrowserEvent = s;
  }
}
const Dn = {};
class $r extends Mi {
  /**
   * @param {Options} [options] Options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, t = t || {}, this.boundAddFeature_ = this.addFeature_.bind(this), this.boundRemoveFeature_ = this.removeFeature_.bind(this), this.condition_ = t.condition ? t.condition : Ja, this.addCondition_ = t.addCondition ? t.addCondition : Oo, this.removeCondition_ = t.removeCondition ? t.removeCondition : Oo, this.toggleCondition_ = t.toggleCondition ? t.toggleCondition : tl, this.multi_ = t.multi ? t.multi : !1, this.filter_ = t.filter ? t.filter : Ze, this.hitTolerance_ = t.hitTolerance ? t.hitTolerance : 0, this.style_ = t.style !== void 0 ? t.style : Gf(), this.features_ = t.features || new Ut();
    let e;
    if (t.layers)
      if (typeof t.layers == "function")
        e = t.layers;
      else {
        const i = t.layers;
        e = function(s) {
          return i.includes(s);
        };
      }
    else
      e = Ze;
    this.layerFilter_ = e, this.featureLayerAssociation_ = {};
  }
  /**
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("../layer/Layer.js").default} layer Layer.
   * @private
   */
  addFeatureLayerAssociation_(t, e) {
    this.featureLayerAssociation_[B(t)] = e;
  }
  /**
   * Get the selected features.
   * @return {Collection<Feature>} Features collection.
   * @api
   */
  getFeatures() {
    return this.features_;
  }
  /**
   * Returns the Hit-detection tolerance.
   * @return {number} Hit tolerance in pixels.
   * @api
   */
  getHitTolerance() {
    return this.hitTolerance_;
  }
  /**
   * Returns the associated {@link module:ol/layer/Vector~VectorLayer vector layer} of
   * a selected feature.
   * @param {import("../Feature.js").default} feature Feature
   * @return {import('../layer/Vector.js').default} Layer.
   * @api
   */
  getLayer(t) {
    return (
      /** @type {import('../layer/Vector.js').default} */
      this.featureLayerAssociation_[B(t)]
    );
  }
  /**
   * Hit-detection tolerance. Pixels inside the radius around the given position
   * will be checked for features.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @api
   */
  setHitTolerance(t) {
    this.hitTolerance_ = t;
  }
  /**
   * Remove the interaction from its current map, if any,  and attach it to a new
   * map, if any. Pass `null` to just remove the interaction from the current map.
   * @param {import("../Map.js").default|null} map Map.
   * @api
   * @override
   */
  setMap(t) {
    this.getMap() && this.style_ && this.features_.forEach(this.restorePreviousStyle_.bind(this)), super.setMap(t), t ? (this.features_.addEventListener(
      ft.ADD,
      this.boundAddFeature_
    ), this.features_.addEventListener(
      ft.REMOVE,
      this.boundRemoveFeature_
    ), this.style_ && this.features_.forEach(this.applySelectedStyle_.bind(this))) : (this.features_.removeEventListener(
      ft.ADD,
      this.boundAddFeature_
    ), this.features_.removeEventListener(
      ft.REMOVE,
      this.boundRemoveFeature_
    ));
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  addFeature_(t) {
    const e = t.element;
    if (this.style_ && this.applySelectedStyle_(e), !this.getLayer(e)) {
      const i = (
        /** @type {VectorLayer} */
        this.getMap().getAllLayers().find(function(s) {
          if (s instanceof $i && s.getSource() && s.getSource().hasFeature(e))
            return s;
        })
      );
      i && this.addFeatureLayerAssociation_(e, i);
    }
  }
  /**
   * @param {import("../Collection.js").CollectionEvent<Feature>} evt Event.
   * @private
   */
  removeFeature_(t) {
    this.style_ && this.restorePreviousStyle_(t.element);
  }
  /**
   * @return {import("../style/Style.js").StyleLike|null} Select style.
   */
  getStyle() {
    return this.style_;
  }
  /**
   * @param {Feature} feature Feature
   * @private
   */
  applySelectedStyle_(t) {
    const e = B(t);
    e in Dn || (Dn[e] = t.getStyle()), t.setStyle(this.style_);
  }
  /**
   * @param {Feature} feature Feature
   * @private
   */
  restorePreviousStyle_(t) {
    const e = this.getMap().getInteractions().getArray();
    for (let s = e.length - 1; s >= 0; --s) {
      const r = e[s];
      if (r !== this && r instanceof $r && r.getStyle() && r.getFeatures().getArray().lastIndexOf(t) !== -1) {
        t.setStyle(r.getStyle());
        return;
      }
    }
    const i = B(t);
    t.setStyle(Dn[i]), delete Dn[i];
  }
  /**
   * @param {Feature} feature Feature.
   * @private
   */
  removeFeatureLayerAssociation_(t) {
    delete this.featureLayerAssociation_[B(t)];
  }
  /**
   * Handles the {@link module:ol/MapBrowserEvent~MapBrowserEvent map browser event} and may change the
   * selected state of features.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @override
   */
  handleEvent(t) {
    if (!this.condition_(t))
      return !0;
    const e = this.addCondition_(t), i = this.removeCondition_(t), s = this.toggleCondition_(t), r = !e && !i && !s, o = t.map, a = this.getFeatures(), l = [], c = [];
    if (r) {
      Li(this.featureLayerAssociation_), o.forEachFeatureAtPixel(
        t.pixel,
        /**
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         * @param {import("../layer/Layer.js").default} layer Layer.
         * @return {boolean|undefined} Continue to iterate over the features.
         */
        (h, u) => {
          if (!(!(h instanceof un) || !this.filter_(h, u)))
            return this.addFeatureLayerAssociation_(h, u), c.push(h), !this.multi_;
        },
        {
          layerFilter: this.layerFilter_,
          hitTolerance: this.hitTolerance_
        }
      );
      for (let h = a.getLength() - 1; h >= 0; --h) {
        const u = a.item(h), d = c.indexOf(u);
        d > -1 ? c.splice(d, 1) : (a.remove(u), l.push(u));
      }
      c.length !== 0 && a.extend(c);
    } else {
      o.forEachFeatureAtPixel(
        t.pixel,
        /**
         * @param {import("../Feature.js").FeatureLike} feature Feature.
         * @param {import("../layer/Layer.js").default} layer Layer.
         * @return {boolean|undefined} Continue to iterate over the features.
         */
        (h, u) => {
          if (!(!(h instanceof un) || !this.filter_(h, u)))
            return (e || s) && !a.getArray().includes(h) ? (this.addFeatureLayerAssociation_(h, u), c.push(h)) : (i || s) && a.getArray().includes(h) && (l.push(h), this.removeFeatureLayerAssociation_(h)), !this.multi_;
        },
        {
          layerFilter: this.layerFilter_,
          hitTolerance: this.hitTolerance_
        }
      );
      for (let h = l.length - 1; h >= 0; --h)
        a.remove(l[h]);
      a.extend(c);
    }
    return (c.length > 0 || l.length > 0) && this.dispatchEvent(
      new Nf(
        kf.SELECT,
        c,
        l,
        t
      )
    ), !0;
  }
}
function Gf() {
  const n = qu();
  return Ji(n.Polygon, n.LineString), Ji(n.GeometryCollection, n.LineString), function(t) {
    return t.getGeometry() ? n[t.getGeometry().getType()] : null;
  };
}
function aa(n, t, e, i, s, r, o) {
  let a, l;
  const c = (e - t) / i;
  if (c === 1)
    a = t;
  else if (c === 2)
    a = t, l = s;
  else if (c !== 0) {
    let h = n[t], u = n[t + 1], d = 0;
    const f = [0];
    for (let _ = t + i; _ < e; _ += i) {
      const p = n[_], E = n[_ + 1];
      d += Math.sqrt((p - h) * (p - h) + (E - u) * (E - u)), f.push(d), h = p, u = E;
    }
    const g = s * d, m = Kl(f, g);
    m < 0 ? (l = (g - f[-m - 2]) / (f[-m - 1] - f[-m - 2]), a = t + (-m - 2) * i) : a = t + m * i;
  }
  o = o > 1 ? o : 2, r = r || new Array(o);
  for (let h = 0; h < o; ++h)
    r[h] = a === void 0 ? NaN : l === void 0 ? n[a + h] : Nt(n[a + h], n[a + i + h], l);
  return r;
}
let zf = !1;
function Wf(n, t, e, i, s, r, o) {
  const a = new XMLHttpRequest();
  a.open(
    "GET",
    typeof n == "function" ? n(e, i, s) : n,
    !0
  ), t.getType() == "arraybuffer" && (a.responseType = "arraybuffer"), a.withCredentials = zf, a.onload = function(l) {
    if (!a.status || a.status >= 200 && a.status < 300) {
      const c = t.getType();
      try {
        let h;
        c == "text" || c == "json" ? h = a.responseText : c == "xml" ? h = a.responseXML || a.responseText : c == "arraybuffer" && (h = /** @type {ArrayBuffer} */
        a.response), h ? r(
          /** @type {Array<FeatureType>} */
          t.readFeatures(h, {
            extent: e,
            featureProjection: s
          }),
          t.readProjection(h)
        ) : o();
      } catch {
        o();
      }
    } else
      o();
  }, a.onerror = o, a.send();
}
function la(n, t) {
  return function(e, i, s, r, o) {
    Wf(
      n,
      t,
      e,
      i,
      s,
      /**
       * @param {Array<FeatureType>} features The loaded features.
       * @param {import("./proj/Projection.js").default} dataProjection Data
       * projection.
       */
      (a, l) => {
        this.addFeatures(a), r !== void 0 && r(a);
      },
      () => {
        this.changed(), o !== void 0 && o();
      }
    );
  };
}
function Xf(n, t) {
  return [[-1 / 0, -1 / 0, 1 / 0, 1 / 0]];
}
function Yf(n, t, e, i) {
  const s = [];
  let r = Yt();
  for (let o = 0, a = e.length; o < a; ++o) {
    const l = e[o];
    r = pr(
      n,
      t,
      l[0],
      i
    ), s.push((r[0] + r[2]) / 2, (r[1] + r[3]) / 2), t = l[l.length - 1];
  }
  return s;
}
const ha = jt();
class Vt {
  /**
   * @param {Type} type Geometry type.
   * @param {Array<number>} flatCoordinates Flat coordinates. These always need
   *     to be right-handed for polygons.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @param {Object<string, *>} properties Properties.
   * @param {number|string|undefined} id Feature id.
   */
  constructor(t, e, i, s, r, o) {
    this.styleFunction, this.extent_, this.id_ = o, this.type_ = t, this.flatCoordinates_ = e, this.flatInteriorPoints_ = null, this.flatMidpoints_ = null, this.ends_ = i || null, this.properties_ = r, this.squaredTolerance_, this.stride_ = s, this.simplifiedGeometry_;
  }
  /**
   * Get a feature property by its key.
   * @param {string} key Key
   * @return {*} Value for the requested key.
   * @api
   */
  get(t) {
    return this.properties_[t];
  }
  /**
   * Get the extent of this feature's geometry.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent() {
    return this.extent_ || (this.extent_ = this.type_ === "Point" ? wa(this.flatCoordinates_) : pr(
      this.flatCoordinates_,
      0,
      this.flatCoordinates_.length,
      2
    )), this.extent_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoint() {
    if (!this.flatInteriorPoints_) {
      const t = je(this.getExtent());
      this.flatInteriorPoints_ = Ar(
        this.flatCoordinates_,
        0,
        this.ends_,
        2,
        t,
        0
      );
    }
    return this.flatInteriorPoints_;
  }
  /**
   * @return {Array<number>} Flat interior points.
   */
  getFlatInteriorPoints() {
    if (!this.flatInteriorPoints_) {
      const t = _c(this.flatCoordinates_, this.ends_), e = Yf(this.flatCoordinates_, 0, t, 2);
      this.flatInteriorPoints_ = cc(
        this.flatCoordinates_,
        0,
        t,
        2,
        e
      );
    }
    return this.flatInteriorPoints_;
  }
  /**
   * @return {Array<number>} Flat midpoint.
   */
  getFlatMidpoint() {
    return this.flatMidpoints_ || (this.flatMidpoints_ = aa(
      this.flatCoordinates_,
      0,
      this.flatCoordinates_.length,
      2,
      0.5
    )), this.flatMidpoints_;
  }
  /**
   * @return {Array<number>} Flat midpoints.
   */
  getFlatMidpoints() {
    if (!this.flatMidpoints_) {
      this.flatMidpoints_ = [];
      const t = this.flatCoordinates_;
      let e = 0;
      const i = (
        /** @type {Array<number>} */
        this.ends_
      );
      for (let s = 0, r = i.length; s < r; ++s) {
        const o = i[s], a = aa(t, e, o, 2, 0.5);
        Ji(this.flatMidpoints_, a), e = o;
      }
    }
    return this.flatMidpoints_;
  }
  /**
   * Get the feature identifier.  This is a stable identifier for the feature and
   * is set when reading data from a remote source.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id_;
  }
  /**
   * @return {Array<number>} Flat coordinates.
   */
  getOrientedFlatCoordinates() {
    return this.flatCoordinates_;
  }
  /**
   * For API compatibility with {@link module:ol/Feature~Feature}, this method is useful when
   * determining the geometry type in style function (see {@link #getType}).
   * @return {RenderFeature} Feature.
   * @api
   */
  getGeometry() {
    return this;
  }
  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {RenderFeature} Simplified geometry.
   */
  getSimplifiedGeometry(t) {
    return this;
  }
  /**
   * Get a transformed and simplified version of the geometry.
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../proj.js").TransformFunction} [transform] Optional transform function.
   * @return {RenderFeature} Simplified geometry.
   */
  simplifyTransformed(t, e) {
    return this;
  }
  /**
   * Get the feature properties.
   * @return {Object<string, *>} Feature properties.
   * @api
   */
  getProperties() {
    return this.properties_;
  }
  /**
   * Get an object of all property names and values.  This has the same behavior as getProperties,
   * but is here to conform with the {@link module:ol/Feature~Feature} interface.
   * @return {Object<string, *>?} Object.
   */
  getPropertiesInternal() {
    return this.properties_;
  }
  /**
   * @return {number} Stride.
   */
  getStride() {
    return this.stride_;
  }
  /**
   * @return {import('../style/Style.js').StyleFunction|undefined} Style
   */
  getStyleFunction() {
    return this.styleFunction;
  }
  /**
   * Get the type of this feature's geometry.
   * @return {Type} Geometry type.
   * @api
   */
  getType() {
    return this.type_;
  }
  /**
   * Transform geometry coordinates from tile pixel space to projected.
   *
   * @param {import("../proj.js").ProjectionLike} projection The data projection
   */
  transform(t) {
    t = At(t);
    const e = t.getExtent(), i = t.getWorldExtent();
    if (e && i) {
      const s = Rt(i) / Rt(e);
      pe(
        ha,
        i[0],
        i[3],
        s,
        -s,
        0,
        0,
        0
      ), Me(
        this.flatCoordinates_,
        0,
        this.flatCoordinates_.length,
        2,
        ha,
        this.flatCoordinates_
      );
    }
  }
  /**
   * Apply a transform function to the coordinates of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @param {import("../proj.js").TransformFunction} transformFn Transform function.
   */
  applyTransform(t) {
    t(this.flatCoordinates_, this.flatCoordinates_, this.stride_);
  }
  /**
   * @return {RenderFeature} A cloned render feature.
   */
  clone() {
    return new Vt(
      this.type_,
      this.flatCoordinates_.slice(),
      this.ends_?.slice(),
      this.stride_,
      Object.assign({}, this.properties_),
      this.id_
    );
  }
  /**
   * @return {Array<number>|null} Ends.
   */
  getEnds() {
    return this.ends_;
  }
  /**
   * Add transform and resolution based geometry simplification to this instance.
   * @return {RenderFeature} This render feature.
   */
  enableSimplifyTransformed() {
    return this.simplifyTransformed = fa((t, e) => {
      if (t === this.squaredTolerance_)
        return this.simplifiedGeometry_;
      this.simplifiedGeometry_ = this.clone(), e && this.simplifiedGeometry_.applyTransform(e);
      const i = this.simplifiedGeometry_.getFlatCoordinates();
      let s;
      switch (this.type_) {
        case "LineString":
          i.length = Lr(
            i,
            0,
            this.simplifiedGeometry_.flatCoordinates_.length,
            this.simplifiedGeometry_.stride_,
            t,
            i,
            0
          ), s = [i.length];
          break;
        case "MultiLineString":
          s = [], i.length = ac(
            i,
            0,
            this.simplifiedGeometry_.ends_,
            this.simplifiedGeometry_.stride_,
            t,
            i,
            0,
            s
          );
          break;
        case "Polygon":
          s = [], i.length = Ba(
            i,
            0,
            this.simplifiedGeometry_.ends_,
            this.simplifiedGeometry_.stride_,
            Math.sqrt(t),
            i,
            0,
            s
          );
          break;
      }
      return s && (this.simplifiedGeometry_ = new Vt(
        this.type_,
        i,
        s,
        2,
        this.properties_,
        this.id_
      )), this.squaredTolerance_ = t, this.simplifiedGeometry_;
    }), this;
  }
}
Vt.prototype.getFlatCoordinates = Vt.prototype.getOrientedFlatCoordinates;
class ca {
  /**
   * @param {number} [maxEntries] Max entries.
   */
  constructor(t) {
    this.rbush_ = new sl(t), this.items_ = {};
  }
  /**
   * Insert a value into the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  insert(t, e) {
    const i = {
      minX: t[0],
      minY: t[1],
      maxX: t[2],
      maxY: t[3],
      value: e
    };
    this.rbush_.insert(i), this.items_[B(e)] = i;
  }
  /**
   * Bulk-insert values into the RBush.
   * @param {Array<import("../extent.js").Extent>} extents Extents.
   * @param {Array<T>} values Values.
   */
  load(t, e) {
    const i = new Array(e.length);
    for (let s = 0, r = e.length; s < r; s++) {
      const o = t[s], a = e[s], l = {
        minX: o[0],
        minY: o[1],
        maxX: o[2],
        maxY: o[3],
        value: a
      };
      i[s] = l, this.items_[B(a)] = l;
    }
    this.rbush_.load(i);
  }
  /**
   * Remove a value from the RBush.
   * @param {T} value Value.
   * @return {boolean} Removed.
   */
  remove(t) {
    const e = B(t), i = this.items_[e];
    return delete this.items_[e], this.rbush_.remove(i) !== null;
  }
  /**
   * Update the extent of a value in the RBush.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {T} value Value.
   */
  update(t, e) {
    const i = this.items_[B(e)], s = [i.minX, i.minY, i.maxX, i.maxY];
    tn(s, t) || (this.remove(e), this.insert(t, e));
  }
  /**
   * Return all values in the RBush.
   * @return {Array<T>} All.
   */
  getAll() {
    return this.rbush_.all().map(function(e) {
      return e.value;
    });
  }
  /**
   * Return all values in the given extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {Array<T>} All in extent.
   */
  getInExtent(t) {
    const e = {
      minX: t[0],
      minY: t[1],
      maxX: t[2],
      maxY: t[3]
    };
    return this.rbush_.search(e).map(function(s) {
      return s.value;
    });
  }
  /**
   * Calls a callback function with each value in the tree.
   * If the callback returns a truthy value, this value is returned without
   * checking the rest of the tree.
   * @param {function(T): R} callback Callback.
   * @return {R|undefined} Callback return value.
   * @template R
   */
  forEach(t) {
    return this.forEach_(this.getAll(), t);
  }
  /**
   * Calls a callback function with each value in the provided extent.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(T): R} callback Callback.
   * @return {R|undefined} Callback return value.
   * @template R
   */
  forEachInExtent(t, e) {
    return this.forEach_(this.getInExtent(t), e);
  }
  /**
   * @param {Array<T>} values Values.
   * @param {function(T): R} callback Callback.
   * @return {R|undefined} Callback return value.
   * @template R
   * @private
   */
  forEach_(t, e) {
    let i;
    for (let s = 0, r = t.length; s < r; s++)
      if (i = e(t[s]), i)
        return i;
    return i;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return Ci(this.items_);
  }
  /**
   * Remove all values from the RBush.
   */
  clear() {
    this.rbush_.clear(), this.items_ = {};
  }
  /**
   * @param {import("../extent.js").Extent} [extent] Extent.
   * @return {import("../extent.js").Extent} Extent.
   */
  getExtent(t) {
    const e = this.rbush_.toJSON();
    return be(e.minX, e.minY, e.maxX, e.maxY, t);
  }
  /**
   * @param {RBush<T>} rbush R-Tree.
   */
  concat(t) {
    this.rbush_.load(t.rbush_.all());
    for (const e in t.items_)
      this.items_[e] = t.items_[e];
  }
}
const kt = {
  /**
   * Triggered when a feature is added to the source.
   * @event module:ol/source/Vector.VectorSourceEvent#addfeature
   * @api
   */
  ADDFEATURE: "addfeature",
  /**
   * Triggered when a feature is updated.
   * @event module:ol/source/Vector.VectorSourceEvent#changefeature
   * @api
   */
  CHANGEFEATURE: "changefeature",
  /**
   * Triggered when the clear method is called on the source.
   * @event module:ol/source/Vector.VectorSourceEvent#clear
   * @api
   */
  CLEAR: "clear",
  /**
   * Triggered when a feature is removed from the source.
   * See {@link module:ol/source/Vector~VectorSource#clear source.clear()} for exceptions.
   * @event module:ol/source/Vector.VectorSourceEvent#removefeature
   * @api
   */
  REMOVEFEATURE: "removefeature",
  /**
   * Triggered when features starts loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadstart
   * @api
   */
  FEATURESLOADSTART: "featuresloadstart",
  /**
   * Triggered when features finishes loading.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloadend
   * @api
   */
  FEATURESLOADEND: "featuresloadend",
  /**
   * Triggered if feature loading results in an error.
   * @event module:ol/source/Vector.VectorSourceEvent#featuresloaderror
   * @api
   */
  FEATURESLOADERROR: "featuresloaderror"
};
class Se extends se {
  /**
   * @param {string} type Type.
   * @param {FeatureType} [feature] Feature.
   * @param {Array<FeatureType>} [features] Features.
   */
  constructor(t, e, i) {
    super(t), this.feature = e, this.features = i;
  }
}
class Kf extends Ol {
  /**
   * @param {Options<FeatureType>} [options] Vector source options.
   */
  constructor(t) {
    t = t || {}, super({
      attributions: t.attributions,
      interpolate: !0,
      projection: void 0,
      state: "ready",
      wrapX: t.wrapX !== void 0 ? t.wrapX : !0
    }), this.on, this.once, this.un, this.loader_ = Qi, this.format_ = t.format || null, this.overlaps_ = t.overlaps === void 0 ? !0 : t.overlaps, this.url_ = t.url, t.loader !== void 0 ? this.loader_ = t.loader : this.url_ !== void 0 && ($(this.format_, "`format` must be set when `url` is set"), this.loader_ = la(this.url_, this.format_)), this.strategy_ = t.strategy !== void 0 ? t.strategy : Xf;
    const e = t.useSpatialIndex !== void 0 ? t.useSpatialIndex : !0;
    this.featuresRtree_ = e ? new ca() : null, this.loadedExtentsRtree_ = new ca(), this.loadingExtentsCount_ = 0, this.nullGeometryFeatures_ = {}, this.idIndex_ = {}, this.uidIndex_ = {}, this.featureChangeKeys_ = {}, this.featuresCollection_ = null;
    let i, s;
    Array.isArray(t.features) ? s = t.features : t.features && (i = t.features, s = i.getArray()), !e && i === void 0 && (i = new Ut(s)), s !== void 0 && this.addFeaturesInternal(s), i !== void 0 && this.bindFeaturesCollection_(i);
  }
  /**
   * Add a single feature to the source.  If you want to add a batch of features
   * at once, call {@link module:ol/source/Vector~VectorSource#addFeatures #addFeatures()}
   * instead. A feature will not be added to the source if feature with
   * the same id is already there. The reason for this behavior is to avoid
   * feature duplication when using bbox or tile loading strategies.
   * Note: this also applies if a {@link module:ol/Collection~Collection} is used for features,
   * meaning that if a feature with a duplicate id is added in the collection, it will
   * be removed from it right away.
   * @param {FeatureType} feature Feature to add.
   * @api
   */
  addFeature(t) {
    this.addFeatureInternal(t), this.changed();
  }
  /**
   * Add a feature without firing a `change` event.
   * @param {FeatureType} feature Feature.
   * @protected
   */
  addFeatureInternal(t) {
    const e = B(t);
    if (!this.addToIndex_(e, t)) {
      this.featuresCollection_ && this.featuresCollection_.remove(t);
      return;
    }
    this.setupChangeEvents_(e, t);
    const i = t.getGeometry();
    if (i) {
      const s = i.getExtent();
      this.featuresRtree_ && this.featuresRtree_.insert(s, t);
    } else
      this.nullGeometryFeatures_[e] = t;
    this.dispatchEvent(
      new Se(kt.ADDFEATURE, t)
    );
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {FeatureType} feature The feature.
   * @private
   */
  setupChangeEvents_(t, e) {
    e instanceof Vt || (this.featureChangeKeys_[t] = [
      U(e, z.CHANGE, this.handleFeatureChange_, this),
      U(
        e,
        wi.PROPERTYCHANGE,
        this.handleFeatureChange_,
        this
      )
    ]);
  }
  /**
   * @param {string} featureKey Unique identifier for the feature.
   * @param {FeatureType} feature The feature.
   * @return {boolean} The feature is "valid", in the sense that it is also a
   *     candidate for insertion into the Rtree.
   * @private
   */
  addToIndex_(t, e) {
    let i = !0;
    if (e.getId() !== void 0) {
      const s = String(e.getId());
      if (!(s in this.idIndex_))
        this.idIndex_[s] = e;
      else if (e instanceof Vt) {
        const r = this.idIndex_[s];
        r instanceof Vt ? Array.isArray(r) ? r.push(e) : this.idIndex_[s] = [r, e] : i = !1;
      } else
        i = !1;
    }
    return i && ($(
      !(t in this.uidIndex_),
      "The passed `feature` was already added to the source"
    ), this.uidIndex_[t] = e), i;
  }
  /**
   * Add a batch of features to the source.
   * @param {Array<FeatureType>} features Features to add.
   * @api
   */
  addFeatures(t) {
    this.addFeaturesInternal(t), this.changed();
  }
  /**
   * Add features without firing a `change` event.
   * @param {Array<FeatureType>} features Features.
   * @protected
   */
  addFeaturesInternal(t) {
    const e = [], i = [], s = [];
    for (let r = 0, o = t.length; r < o; r++) {
      const a = t[r], l = B(a);
      this.addToIndex_(l, a) && i.push(a);
    }
    for (let r = 0, o = i.length; r < o; r++) {
      const a = i[r], l = B(a);
      this.setupChangeEvents_(l, a);
      const c = a.getGeometry();
      if (c) {
        const h = c.getExtent();
        e.push(h), s.push(a);
      } else
        this.nullGeometryFeatures_[l] = a;
    }
    if (this.featuresRtree_ && this.featuresRtree_.load(e, s), this.hasListener(kt.ADDFEATURE))
      for (let r = 0, o = i.length; r < o; r++)
        this.dispatchEvent(
          new Se(kt.ADDFEATURE, i[r])
        );
  }
  /**
   * @param {!Collection<FeatureType>} collection Collection.
   * @private
   */
  bindFeaturesCollection_(t) {
    let e = !1;
    this.addEventListener(
      kt.ADDFEATURE,
      /**
       * @param {VectorSourceEvent<FeatureType>} evt The vector source event
       */
      function(i) {
        e || (e = !0, t.push(i.feature), e = !1);
      }
    ), this.addEventListener(
      kt.REMOVEFEATURE,
      /**
       * @param {VectorSourceEvent<FeatureType>} evt The vector source event
       */
      function(i) {
        e || (e = !0, t.remove(i.feature), e = !1);
      }
    ), t.addEventListener(
      ft.ADD,
      /**
       * @param {import("../Collection.js").CollectionEvent<FeatureType>} evt The collection event
       */
      (i) => {
        e || (e = !0, this.addFeature(i.element), e = !1);
      }
    ), t.addEventListener(
      ft.REMOVE,
      /**
       * @param {import("../Collection.js").CollectionEvent<FeatureType>} evt The collection event
       */
      (i) => {
        e || (e = !0, this.removeFeature(i.element), e = !1);
      }
    ), this.featuresCollection_ = t;
  }
  /**
   * Remove all features from the source.
   * @param {boolean} [fast] Skip dispatching of {@link module:ol/source/Vector.VectorSourceEvent#event:removefeature} events.
   * @api
   */
  clear(t) {
    if (t) {
      for (const i in this.featureChangeKeys_)
        this.featureChangeKeys_[i].forEach(tt);
      this.featuresCollection_ || (this.featureChangeKeys_ = {}, this.idIndex_ = {}, this.uidIndex_ = {});
    } else if (this.featuresRtree_) {
      this.featuresRtree_.forEach((i) => {
        this.removeFeatureInternal(i);
      });
      for (const i in this.nullGeometryFeatures_)
        this.removeFeatureInternal(this.nullGeometryFeatures_[i]);
    }
    this.featuresCollection_ && this.featuresCollection_.clear(), this.featuresRtree_ && this.featuresRtree_.clear(), this.nullGeometryFeatures_ = {};
    const e = new Se(kt.CLEAR);
    this.dispatchEvent(e), this.changed();
  }
  /**
   * Iterate through all features on the source, calling the provided callback
   * with each one.  If the callback returns any "truthy" value, iteration will
   * stop and the function will return the same value.
   * Note: this function only iterate through the feature that have a defined geometry.
   *
   * @param {function(FeatureType): T} callback Called with each feature
   *     on the source.  Return a truthy value to stop iteration.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeature(t) {
    if (this.featuresRtree_)
      return this.featuresRtree_.forEach(t);
    this.featuresCollection_ && this.featuresCollection_.forEach(t);
  }
  /**
   * Iterate through all features whose geometries contain the provided
   * coordinate, calling the callback with each feature.  If the callback returns
   * a "truthy" value, iteration will stop and the function will return the same
   * value.
   *
   * For {@link module:ol/render/Feature~RenderFeature} features, the callback will be
   * called for all features.
   *
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(FeatureType): T} callback Called with each feature
   *     whose goemetry contains the provided coordinate.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   */
  forEachFeatureAtCoordinateDirect(t, e) {
    const i = [t[0], t[1], t[0], t[1]];
    return this.forEachFeatureInExtent(i, function(s) {
      const r = s.getGeometry();
      if (r instanceof Vt || r.intersectsCoordinate(t))
        return e(s);
    });
  }
  /**
   * Iterate through all features whose bounding box intersects the provided
   * extent (note that the feature's geometry may not intersect the extent),
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you are interested in features whose geometry intersects an extent, call
   * the {@link module:ol/source/Vector~VectorSource#forEachFeatureIntersectingExtent #forEachFeatureIntersectingExtent()} method instead.
   *
   * When `useSpatialIndex` is set to false, this method will loop through all
   * features, equivalent to {@link module:ol/source/Vector~VectorSource#forEachFeature #forEachFeature()}.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(FeatureType): T} callback Called with each feature
   *     whose bounding box intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureInExtent(t, e) {
    if (this.featuresRtree_)
      return this.featuresRtree_.forEachInExtent(t, e);
    this.featuresCollection_ && this.featuresCollection_.forEach(e);
  }
  /**
   * Iterate through all features whose geometry intersects the provided extent,
   * calling the callback with each feature.  If the callback returns a "truthy"
   * value, iteration will stop and the function will return the same value.
   *
   * If you only want to test for bounding box intersection, call the
   * {@link module:ol/source/Vector~VectorSource#forEachFeatureInExtent #forEachFeatureInExtent()} method instead.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {function(FeatureType): T} callback Called with each feature
   *     whose geometry intersects the provided extent.
   * @return {T|undefined} The return value from the last call to the callback.
   * @template T
   * @api
   */
  forEachFeatureIntersectingExtent(t, e) {
    return this.forEachFeatureInExtent(
      t,
      /**
       * @param {FeatureType} feature Feature.
       * @return {T|undefined} The return value from the last call to the callback.
       */
      function(i) {
        const s = i.getGeometry();
        if (s instanceof Vt || s.intersectsExtent(t)) {
          const r = e(i);
          if (r)
            return r;
        }
      }
    );
  }
  /**
   * Get the features collection associated with this source. Will be `null`
   * unless the source was configured with `useSpatialIndex` set to `false`, or
   * with a {@link module:ol/Collection~Collection} as `features`.
   * @return {Collection<FeatureType>|null} The collection of features.
   * @api
   */
  getFeaturesCollection() {
    return this.featuresCollection_;
  }
  /**
   * Get a snapshot of the features currently on the source in random order. The returned array
   * is a copy, the features are references to the features in the source.
   * @return {Array<FeatureType>} Features.
   * @api
   */
  getFeatures() {
    let t;
    return this.featuresCollection_ ? t = this.featuresCollection_.getArray().slice(0) : this.featuresRtree_ && (t = this.featuresRtree_.getAll(), Ci(this.nullGeometryFeatures_) || Ji(t, Object.values(this.nullGeometryFeatures_))), t;
  }
  /**
   * Get all features whose geometry intersects the provided coordinate.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {Array<FeatureType>} Features.
   * @api
   */
  getFeaturesAtCoordinate(t) {
    const e = [];
    return this.forEachFeatureAtCoordinateDirect(t, function(i) {
      e.push(i);
    }), e;
  }
  /**
   * Get all features whose bounding box intersects the provided extent.  Note that this returns an array of
   * all features intersecting the given extent in random order (so it may include
   * features whose geometries do not intersect the extent).
   *
   * When `useSpatialIndex` is set to false, this method will return all
   * features.
   *
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {import("../proj/Projection.js").default} [projection] Include features
   * where `extent` exceeds the x-axis bounds of `projection` and wraps around the world.
   * @return {Array<FeatureType>} Features.
   * @api
   */
  getFeaturesInExtent(t, e) {
    if (this.featuresRtree_) {
      if (!(e && e.canWrapX() && this.getWrapX()))
        return this.featuresRtree_.getInExtent(t);
      const s = Ia(t, e);
      return [].concat(
        ...s.map((r) => this.featuresRtree_.getInExtent(r))
      );
    }
    return this.featuresCollection_ ? this.featuresCollection_.getArray().slice(0) : [];
  }
  /**
   * Get the closest feature to the provided coordinate.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false` and the features in this source are of type
   * {@link module:ol/Feature~Feature}.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {function(FeatureType):boolean} [filter] Feature filter function.
   *     The filter function will receive one argument, the {@link module:ol/Feature~Feature feature}
   *     and it should return a boolean value. By default, no filtering is made.
   * @return {FeatureType} Closest feature.
   * @api
   */
  getClosestFeatureToCoordinate(t, e) {
    const i = t[0], s = t[1];
    let r = null;
    const o = [NaN, NaN];
    let a = 1 / 0;
    const l = [-1 / 0, -1 / 0, 1 / 0, 1 / 0];
    return e = e || Ze, this.featuresRtree_.forEachInExtent(
      l,
      /**
       * @param {FeatureType} feature Feature.
       */
      function(c) {
        if (e(c)) {
          const h = c.getGeometry(), u = a;
          if (a = h instanceof Vt ? 0 : h.closestPointXY(i, s, o, a), a < u) {
            r = c;
            const d = Math.sqrt(a);
            l[0] = i - d, l[1] = s - d, l[2] = i + d, l[3] = s + d;
          }
        }
      }
    ), r;
  }
  /**
   * Get the extent of the features currently in the source.
   *
   * This method is not available when the source is configured with
   * `useSpatialIndex` set to `false`.
   * @param {import("../extent.js").Extent} [extent] Destination extent. If provided, no new extent
   *     will be created. Instead, that extent's coordinates will be overwritten.
   * @return {import("../extent.js").Extent} Extent.
   * @api
   */
  getExtent(t) {
    return this.featuresRtree_.getExtent(t);
  }
  /**
   * Get a feature by its identifier (the value returned by feature.getId()). When `RenderFeature`s
   * are used, `getFeatureById()` can return an array of `RenderFeature`s. This allows for handling
   * of `GeometryCollection` geometries, where format readers create one `RenderFeature` per
   * `GeometryCollection` member.
   * Note that the index treats string and numeric identifiers as the same.  So
   * `source.getFeatureById(2)` will return a feature with id `'2'` or `2`.
   *
   * @param {string|number} id Feature identifier.
   * @return {FeatureClassOrArrayOfRenderFeatures<FeatureType>|null} The feature (or `null` if not found).
   * @api
   */
  getFeatureById(t) {
    const e = this.idIndex_[t.toString()];
    return e !== void 0 ? (
      /** @type {FeatureClassOrArrayOfRenderFeatures<FeatureType>} */
      e
    ) : null;
  }
  /**
   * Get a feature by its internal unique identifier (using `getUid`).
   *
   * @param {string} uid Feature identifier.
   * @return {FeatureType|null} The feature (or `null` if not found).
   */
  getFeatureByUid(t) {
    const e = this.uidIndex_[t];
    return e !== void 0 ? e : null;
  }
  /**
   * Get the format associated with this source.
   *
   * @return {import("../format/Feature.js").default<FeatureType>|null}} The feature format.
   * @api
   */
  getFormat() {
    return this.format_;
  }
  /**
   * @return {boolean} The source can have overlapping geometries.
   */
  getOverlaps() {
    return this.overlaps_;
  }
  /**
   * Get the url associated with this source.
   *
   * @return {string|import("../featureloader.js").FeatureUrlFunction|undefined} The url.
   * @api
   */
  getUrl() {
    return this.url_;
  }
  /**
   * @param {Event} event Event.
   * @private
   */
  handleFeatureChange_(t) {
    const e = (
      /** @type {FeatureType} */
      t.target
    ), i = B(e), s = e.getGeometry();
    if (!s)
      i in this.nullGeometryFeatures_ || (this.featuresRtree_ && this.featuresRtree_.remove(e), this.nullGeometryFeatures_[i] = e);
    else {
      const o = s.getExtent();
      i in this.nullGeometryFeatures_ ? (delete this.nullGeometryFeatures_[i], this.featuresRtree_ && this.featuresRtree_.insert(o, e)) : this.featuresRtree_ && this.featuresRtree_.update(o, e);
    }
    const r = e.getId();
    if (r !== void 0) {
      const o = r.toString();
      this.idIndex_[o] !== e && (this.removeFromIdIndex_(e), this.idIndex_[o] = e);
    } else
      this.removeFromIdIndex_(e), this.uidIndex_[i] = e;
    this.changed(), this.dispatchEvent(
      new Se(kt.CHANGEFEATURE, e)
    );
  }
  /**
   * Returns true if the feature is contained within the source.
   * @param {FeatureType} feature Feature.
   * @return {boolean} Has feature.
   * @api
   */
  hasFeature(t) {
    const e = t.getId();
    return e !== void 0 ? e in this.idIndex_ : B(t) in this.uidIndex_;
  }
  /**
   * @return {boolean} Is empty.
   */
  isEmpty() {
    return this.featuresRtree_ ? this.featuresRtree_.isEmpty() && Ci(this.nullGeometryFeatures_) : this.featuresCollection_ ? this.featuresCollection_.getLength() === 0 : !0;
  }
  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {import("../proj/Projection.js").default} projection Projection.
   */
  loadFeatures(t, e, i) {
    const s = this.loadedExtentsRtree_, r = this.strategy_(t, e, i);
    for (let o = 0, a = r.length; o < a; ++o) {
      const l = r[o];
      s.forEachInExtent(
        l,
        /**
         * @param {{extent: import("../extent.js").Extent}} object Object.
         * @return {boolean} Contains.
         */
        function(h) {
          return fi(h.extent, l);
        }
      ) || (++this.loadingExtentsCount_, this.dispatchEvent(
        new Se(kt.FEATURESLOADSTART)
      ), this.loader_.call(
        this,
        l,
        e,
        i,
        /**
         * @param {Array<FeatureType>} features Loaded features
         */
        (h) => {
          --this.loadingExtentsCount_, this.dispatchEvent(
            new Se(
              kt.FEATURESLOADEND,
              void 0,
              h
            )
          );
        },
        () => {
          --this.loadingExtentsCount_, this.dispatchEvent(
            new Se(kt.FEATURESLOADERROR)
          );
        }
      ), s.insert(l, { extent: l.slice() }));
    }
    this.loading = this.loader_.length < 4 ? !1 : this.loadingExtentsCount_ > 0;
  }
  /**
   * @override
   */
  refresh() {
    this.clear(!0), this.loadedExtentsRtree_.clear(), super.refresh();
  }
  /**
   * Remove an extent from the list of loaded extents.
   * @param {import("../extent.js").Extent} extent Extent.
   * @api
   */
  removeLoadedExtent(t) {
    const e = this.loadedExtentsRtree_, i = e.forEachInExtent(t, function(s) {
      if (tn(s.extent, t))
        return s;
    });
    i && e.remove(i);
  }
  /**
   * Batch remove features from the source.  If you want to remove all features
   * at once, use the {@link module:ol/source/Vector~VectorSource#clear #clear()} method
   * instead.
   * @param {Array<FeatureType>} features Features to remove.
   * @api
   */
  removeFeatures(t) {
    let e = !1;
    for (let i = 0, s = t.length; i < s; ++i)
      e = this.removeFeatureInternal(t[i]) || e;
    e && this.changed();
  }
  /**
   * Remove a single feature from the source. If you want to batch remove
   * features, use the {@link module:ol/source/Vector~VectorSource#removeFeatures #removeFeatures()} method
   * instead.
   * @param {FeatureType} feature Feature to remove.
   * @api
   */
  removeFeature(t) {
    if (!t)
      return;
    this.removeFeatureInternal(t) && this.changed();
  }
  /**
   * Remove feature without firing a `change` event.
   * @param {FeatureType} feature Feature.
   * @return {boolean} True if the feature was removed, false if it was not found.
   * @protected
   */
  removeFeatureInternal(t) {
    const e = B(t);
    if (!(e in this.uidIndex_))
      return !1;
    e in this.nullGeometryFeatures_ ? delete this.nullGeometryFeatures_[e] : this.featuresRtree_ && this.featuresRtree_.remove(t), this.featureChangeKeys_[e]?.forEach(tt), delete this.featureChangeKeys_[e];
    const s = t.getId();
    if (s !== void 0) {
      const r = s.toString(), o = this.idIndex_[r];
      o === t ? delete this.idIndex_[r] : Array.isArray(o) && (o.splice(o.indexOf(t), 1), o.length === 1 && (this.idIndex_[r] = o[0]));
    }
    return delete this.uidIndex_[e], this.hasListener(kt.REMOVEFEATURE) && this.dispatchEvent(
      new Se(kt.REMOVEFEATURE, t)
    ), !0;
  }
  /**
   * Remove a feature from the id index.  Called internally when the feature id
   * may have changed.
   * @param {FeatureType} feature The feature.
   * @private
   */
  removeFromIdIndex_(t) {
    for (const e in this.idIndex_)
      if (this.idIndex_[e] === t) {
        delete this.idIndex_[e];
        break;
      }
  }
  /**
   * Set the new loader of the source. The next render cycle will use the
   * new loader.
   * @param {import("../featureloader.js").FeatureLoader} loader The loader to set.
   * @api
   */
  setLoader(t) {
    this.loader_ = t;
  }
  /**
   * Points the source to a new url. The next render cycle will use the new url.
   * @param {string|import("../featureloader.js").FeatureUrlFunction} url Url.
   * @api
   */
  setUrl(t) {
    $(this.format_, "`format` must be set when `url` is set"), this.url_ = t, this.setLoader(la(t, this.format_));
  }
  /**
   * @param {boolean} overlaps The source can have overlapping geometries.
   */
  setOverlaps(t) {
    this.overlaps_ = t, this.changed();
  }
}
const pt = {
  ELEMENT: "element",
  MAP: "map",
  OFFSET: "offset",
  POSITION: "position",
  POSITIONING: "positioning"
};
class Bf extends $t {
  /**
   * @param {Options} options Overlay options.
   */
  constructor(t) {
    super(), this.on, this.once, this.un, this.options = t, this.id = t.id, this.insertFirst = t.insertFirst !== void 0 ? t.insertFirst : !0, this.stopEvent = t.stopEvent !== void 0 ? t.stopEvent : !0, this.element = document.createElement("div"), this.element.className = t.className !== void 0 ? t.className : "ol-overlay-container " + Tc, this.element.style.position = "absolute", this.element.style.pointerEvents = "auto", this.autoPan = t.autoPan === !0 ? {} : t.autoPan || void 0, this.rendered = {
      transform_: "",
      visible: !0
    }, this.mapPostrenderListenerKey = null, this.addChangeListener(pt.ELEMENT, this.handleElementChanged), this.addChangeListener(pt.MAP, this.handleMapChanged), this.addChangeListener(pt.OFFSET, this.handleOffsetChanged), this.addChangeListener(pt.POSITION, this.handlePositionChanged), this.addChangeListener(pt.POSITIONING, this.handlePositioningChanged), t.element !== void 0 && this.setElement(t.element), this.setOffset(t.offset !== void 0 ? t.offset : [0, 0]), this.setPositioning(t.positioning || "top-left"), t.position !== void 0 && this.setPosition(t.position);
  }
  /**
   * Get the DOM element of this overlay.
   * @return {HTMLElement|undefined} The Element containing the overlay.
   * @observable
   * @api
   */
  getElement() {
    return (
      /** @type {HTMLElement|undefined} */
      this.get(pt.ELEMENT)
    );
  }
  /**
   * Get the overlay identifier which is set on constructor.
   * @return {number|string|undefined} Id.
   * @api
   */
  getId() {
    return this.id;
  }
  /**
   * Get the map associated with this overlay.
   * @return {import("./Map.js").default|null} The map that the
   * overlay is part of.
   * @observable
   * @api
   */
  getMap() {
    return (
      /** @type {import("./Map.js").default|null} */
      this.get(pt.MAP) || null
    );
  }
  /**
   * Get the offset of this overlay.
   * @return {Array<number>} The offset.
   * @observable
   * @api
   */
  getOffset() {
    return (
      /** @type {Array<number>} */
      this.get(pt.OFFSET)
    );
  }
  /**
   * Get the current position of this overlay.
   * @return {import("./coordinate.js").Coordinate|undefined} The spatial point that the overlay is
   *     anchored at.
   * @observable
   * @api
   */
  getPosition() {
    return (
      /** @type {import("./coordinate.js").Coordinate|undefined} */
      this.get(pt.POSITION)
    );
  }
  /**
   * Get the current positioning of this overlay.
   * @return {Positioning} How the overlay is positioned
   *     relative to its point on the map.
   * @observable
   * @api
   */
  getPositioning() {
    return (
      /** @type {Positioning} */
      this.get(pt.POSITIONING)
    );
  }
  /**
   * @protected
   */
  handleElementChanged() {
    Ha(this.element);
    const t = this.getElement();
    t && this.element.appendChild(t);
  }
  /**
   * @protected
   */
  handleMapChanged() {
    this.mapPostrenderListenerKey && (this.element?.remove(), tt(this.mapPostrenderListenerKey), this.mapPostrenderListenerKey = null);
    const t = this.getMap();
    if (t) {
      this.mapPostrenderListenerKey = U(
        t,
        de.POSTRENDER,
        this.render,
        this
      ), this.updatePixelPosition();
      const e = this.stopEvent ? t.getOverlayContainerStopEvent() : t.getOverlayContainer();
      this.insertFirst ? e.insertBefore(this.element, e.childNodes[0] || null) : e.appendChild(this.element), this.performAutoPan();
    }
  }
  /**
   * @protected
   */
  render() {
    this.updatePixelPosition();
  }
  /**
   * @protected
   */
  handleOffsetChanged() {
    this.updatePixelPosition();
  }
  /**
   * @protected
   */
  handlePositionChanged() {
    this.updatePixelPosition(), this.performAutoPan();
  }
  /**
   * @protected
   */
  handlePositioningChanged() {
    this.updatePixelPosition();
  }
  /**
   * Set the DOM element to be associated with this overlay.
   * @param {HTMLElement|undefined} element The Element containing the overlay.
   * @observable
   * @api
   */
  setElement(t) {
    this.set(pt.ELEMENT, t);
  }
  /**
   * Set the map to be associated with this overlay.
   * @param {import("./Map.js").default|null} map The map that the
   * overlay is part of. Pass `null` to just remove the overlay from the current map.
   * @observable
   * @api
   */
  setMap(t) {
    this.set(pt.MAP, t);
  }
  /**
   * Set the offset for this overlay.
   * @param {Array<number>} offset Offset.
   * @observable
   * @api
   */
  setOffset(t) {
    this.set(pt.OFFSET, t);
  }
  /**
   * Set the position for this overlay. If the position is `undefined` the
   * overlay is hidden.
   * @param {import("./coordinate.js").Coordinate|undefined} position The spatial point that the overlay
   *     is anchored at.
   * @observable
   * @api
   */
  setPosition(t) {
    this.set(pt.POSITION, t);
  }
  /**
   * Pan the map so that the overlay is entirely visible in the current viewport
   * (if necessary) using the configured autoPan parameters
   * @protected
   */
  performAutoPan() {
    this.autoPan && this.panIntoView(this.autoPan);
  }
  /**
   * Pan the map so that the overlay is entirely visible in the current viewport
   * (if necessary).
   * @param {PanIntoViewOptions} [panIntoViewOptions] Options for the pan action
   * @api
   */
  panIntoView(t) {
    const e = this.getMap();
    if (!e || !e.getTargetElement() || !this.get(pt.POSITION))
      return;
    const i = this.getRect(e.getTargetElement(), e.getSize()), s = this.getElement(), r = this.getRect(s, [
      vc(s),
      Lc(s)
    ]);
    t = t || {};
    const o = t.margin === void 0 ? 20 : t.margin;
    if (!fi(i, r)) {
      const a = r[0] - i[0], l = i[2] - r[2], c = r[1] - i[1], h = i[3] - r[3], u = [0, 0];
      if (a < 0 ? u[0] = a - o : l < 0 && (u[0] = Math.abs(l) + o), c < 0 ? u[1] = c - o : h < 0 && (u[1] = Math.abs(h) + o), u[0] !== 0 || u[1] !== 0) {
        const d = (
          /** @type {import("./coordinate.js").Coordinate} */
          e.getView().getCenterInternal()
        ), f = e.getPixelFromCoordinateInternal(d);
        if (!f)
          return;
        const g = [f[0] + u[0], f[1] + u[1]], m = t.animation || {};
        e.getView().animateInternal({
          center: e.getCoordinateFromPixelInternal(g),
          duration: m.duration,
          easing: m.easing
        });
      }
    }
  }
  /**
   * Get the extent of an element relative to the document
   * @param {HTMLElement} element The element.
   * @param {import("./size.js").Size} size The size of the element.
   * @return {import("./extent.js").Extent} The extent.
   * @protected
   */
  getRect(t, e) {
    const i = t.getBoundingClientRect(), s = i.left + window.pageXOffset, r = i.top + window.pageYOffset;
    return [s, r, s + e[0], r + e[1]];
  }
  /**
   * Set the positioning for this overlay.
   * @param {Positioning} positioning how the overlay is
   *     positioned relative to its point on the map.
   * @observable
   * @api
   */
  setPositioning(t) {
    this.set(pt.POSITIONING, t);
  }
  /**
   * Modify the visibility of the element.
   * @param {boolean} visible Element visibility.
   * @protected
   */
  setVisible(t) {
    this.rendered.visible !== t && (this.element.style.display = t ? "" : "none", this.rendered.visible = t);
  }
  /**
   * Update pixel position.
   * @protected
   */
  updatePixelPosition() {
    const t = this.getMap(), e = this.getPosition();
    if (!t || !t.isRendered() || !e) {
      this.setVisible(!1);
      return;
    }
    const i = t.getPixelFromCoordinate(e), s = t.getSize();
    this.updateRenderedPosition(i, s);
  }
  /**
   * @param {import("./pixel.js").Pixel} pixel The pixel location.
   * @param {import("./size.js").Size|undefined} mapSize The map size.
   * @protected
   */
  updateRenderedPosition(t, e) {
    const i = this.element.style, s = this.getOffset(), r = this.getPositioning();
    this.setVisible(!0);
    const o = Math.round(t[0] + s[0]) + "px", a = Math.round(t[1] + s[1]) + "px";
    let l = "0%", c = "0%";
    r == "bottom-right" || r == "center-right" || r == "top-right" ? l = "-100%" : (r == "bottom-center" || r == "center-center" || r == "top-center") && (l = "-50%"), r == "bottom-left" || r == "bottom-center" || r == "bottom-right" ? c = "-100%" : (r == "center-left" || r == "center-center" || r == "center-right") && (c = "-50%");
    const h = `translate(${l}, ${c}) translate(${o}, ${a})`;
    this.rendered.transform_ != h && (this.rendered.transform_ = h, i.transform = h);
  }
  /**
   * returns the options this Overlay has been created with
   * @return {Options} overlay options
   */
  getOptions() {
    return this.options;
  }
}
function gr(n) {
  const t = new Kf(), e = [];
  return n.forEach(function(i) {
    const s = new un(
      new us(Tr([i.coord.lon, i.coord.lat]))
    );
    s.setProperties(i), e.push(s);
  }), t.addFeatures(e), t;
}
async function Ge(n, t) {
  const e = await Vf(n, t);
  return {
    coord: {
      lon: n,
      lat: t
    },
    sensor_name: "Air Properties Sensor",
    module_name: "Modul 2",
    data: e
  };
}
async function Vf(n, t) {
  let e = `https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${n}&models=icon_seamless&current=temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure&forecast_days=1`;
  const s = await (await fetch(e, {
    method: "GET"
  })).json();
  return {
    wind_speed: s.current.wind_speed_10m,
    wind_direction: s.current.wind_direction_10m,
    air_temperature: s.current.temperature_2m,
    barometric_pressure: s.current.surface_pressure,
    humidity: s.current.relative_humidity_2m,
    battery_voltage: 4
  };
}
const Zf = [
  await Ge(9.542039207249285, 54.51069732199451),
  // Schleswig Schloss
  await Ge(9.71559392307798, 54.52414462677734),
  // Missunde
  await Ge(9.934568072662614, 54.66034130282637),
  // Kappeln
  await Ge(11.19104586109911, 54.51394399850085),
  // Fehmarn
  await Ge(12.607701028979859, 41.8793343283549),
  // Rom
  await Ge(-1.7277645297286661, 43.40528026437781),
  // San Sebastian
  await Ge(32.559898, 15.508457)
  // Khartum Afrika
  // await createAirPropertiesSensorData(9.4667, 54.796),
  // await createAirPropertiesSensorData(9.467, 54.7885),
  // await createAirPropertiesSensorData(9.4295, 54.802),
  // await createAirPropertiesSensorData(9.868234526079595, 54.47305515348609), // Eckernförde
  // await createAirPropertiesSensorData(10.133823712178105, 54.31114321214153), // Kiel Querkai
  // await createAirPropertiesSensorData(10.17132953616414, 54.329012329712754), // Kiel Schwentine Werft
  // await createAirPropertiesSensorData(10.216554343991787, 54.4042499260097), // Kiel Laboe
  // await createAirPropertiesSensorData(9.711172066706121, 54.313332929813754), // Rendsburg
  // await createAirPropertiesSensorData(9.126408784000207, 53.88780618582467), // Brunsbüttel
  // await createAirPropertiesSensorData(10.980480508401266, 54.375842855573865), // Heiligenhafen
  // await createAirPropertiesSensorData(8.296229935540385, 54.909481414684905), // Westerland
  // await createAirPropertiesSensorData(8.694068755148862, 54.73080963743536), // Dagebüll
  // await createAirPropertiesSensorData(8.815529667066356, 54.48633428418012), // Nordstrand
  // await createAirPropertiesSensorData(8.58397921359508, 54.324191810957615), // Sankt Peter Ording
  // await createAirPropertiesSensorData(8.849777321827073, 54.12813503606), // Büsum
  // await createAirPropertiesSensorData( 9.591076207849072, 54.845860511473575), // Bockholm
];
function Uf(n) {
  const t = n.get("data"), e = new rt({
    image: new Pi({
      src: "data:image/svg+xml;utf8," + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,0 90,100 50,80 10,100" fill="blue"/>
            </svg>
        `),
      rotation: Math.PI / 180 * (t.wind_direction + 180),
      rotateWithView: !0,
      scale: 0.75,
      anchor: [0.5, 0.6]
    })
  });
  return [new rt({
    image: new qt({
      radius: 15,
      fill: new ht({ color: "rgba(236, 248, 255, 0.86)" }),
      stroke: new lt({ color: "#0066cc", width: 1 })
    }),
    text: new Ee({
      font: "14px Calibri,sans-serif",
      text: "M2",
      // Use the 'name' property for the label
      fill: new ht({ color: "#000" }),
      stroke: new lt({ color: "#fff", width: 3 }),
      offsetY: -15
    })
  }), e];
}
function jf(n, t) {
  const e = n.get("data"), i = new rt({
    image: new Pi({
      src: "data:image/svg+xml;utf8," + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,0 90,100 50,80 10,100" fill="${t}"/>
            </svg>
        `),
      rotation: Math.PI / 180 * (e.wind_direction + 180),
      rotateWithView: !0,
      scale: 0.75,
      anchor: [0.5, 0.6]
    })
  });
  return [new rt({
    image: new qt({
      radius: 15,
      fill: new ht({ color: "rgba(236, 248, 255, 0.86)" }),
      stroke: new lt({ color: t, width: 1 })
    }),
    text: new Ee({
      font: "14px Calibri,sans-serif",
      text: "M2",
      // Use the 'name' property for the label
      fill: new ht({ color: "#000" }),
      stroke: new lt({ color: "#fff", width: 3 }),
      offsetY: -15
    })
  }), i];
}
const Hf = function(n) {
  return Uf(n);
};
function Dl(n) {
  const t = n.get("data"), e = n.get("coord");
  return `
    <p class="p-0 m-0">Module Name: ${n.get("module_name")}</p>

    <p class="p-0 m-0">Longitude: ${e.lon}</p>

    <p class="p-0 m-0">Latitude: ${e.lat}</p>

    <p class="p-0 m-0">Wind Speed: ${t.wind_speed}km/h</p>

    <p class="p-0 m-0">Wind Direction: ${t.wind_direction}°</p>

    <p class="p-0 m-0">Air Temperature: ${t.air_temperature}°C</p>

    <p class="p-0 m-0">Barometric Pressure: ${t.barometric_pressure}hPa</p>

    <p class="p-0 m-0">Humidity: ${t.humidity}%</p>

    <p class="p-0 m-0">Battery Voltage: ${t.battery_voltage}V</p>
    `;
}
function $f(n) {
  let t = document.getElementById("selected-sensor-data"), e = document.createElement("h2"), i = document.createElement("p"), s = document.createElement("div");
  t.innerHTML = "", e.textContent = "Sensor Data", i.textContent = "Sensor Name: " + n.get("sensor_name"), s.innerHTML = Dl(n), t.append(e, i, s);
}
const dn = gr(Zf);
function qf(n, t) {
  return {
    coord: {
      lon: n,
      lat: t
    },
    sensor_name: "Air Quality Sensor",
    module_name: "Modul 3",
    data: {
      trace_gases: {
        co: 10,
        co2: 10,
        so2: 10,
        no2: 10,
        o3: 10
      },
      black_carbon: 10,
      aerosols: 10,
      battery_voltage: 10
    }
  };
}
const Jf = [
  await qf(9.436822129361424, 54.78839605311228)
  // await createSensorData(9.4295, 54.802),
  // await createSensorData(9.542039207249285, 54.51069732199451), // Schleswig Schloss
  // await createSensorData(9.71559392307798, 54.52414462677734), // Missunde
  // await createSensorData(9.934568072662614, 54.66034130282637), // Kappeln
  // await createSensorData(9.868234526079595, 54.47305515348609), // Eckernförde
  // await createSensorData(10.133823712178105, 54.31114321214153), // Kiel Querkai
  // await createSensorData(10.17132953616414, 54.329012329712754), // Kiel Schwentine Werft
  // await createSensorData(10.216554343991787, 54.4042499260097), // Kiel Laboe
  // await createSensorData(9.711172066706121, 54.313332929813754), // Rendsburg
  // await createSensorData(9.126408784000207, 53.88780618582467), // Brunsbüttel
  // await createSensorData(10.980480508401266, 54.375842855573865), // Heiligenhafen
  // await createSensorData(11.19104586109911, 54.51394399850085), // Fehmarn
  // await createSensorData(8.296229935540385, 54.909481414684905), // Westerland
  // await createSensorData(8.694068755148862, 54.73080963743536), // Dagebüll
  // await createSensorData(8.815529667066356, 54.48633428418012), // Nordstrand
  // await createSensorData(8.58397921359508, 54.324191810957615), // Sankt Peter Ording
  // await createSensorData(8.849777321827073, 54.12813503606), // Büsum
  // await createSensorData( 9.591076207849072, 54.845860511473575), // Bockholm
];
function Qf(n) {
  return n.get("data"), new rt({
    image: new qt({
      radius: 15,
      fill: new ht({ color: "rgba(236, 248, 255, 0.86)" }),
      stroke: new lt({ color: "#0066cc", width: 1 })
    }),
    text: new Ee({
      font: "14px Calibri,sans-serif",
      text: "M3",
      // Use the 'name' property for the label
      fill: new ht({ color: "#000" }),
      stroke: new lt({ color: "#fff", width: 3 }),
      offsetY: -15
    })
  });
}
function tg(n, t) {
  return n.get("data"), new rt({
    image: new qt({
      radius: 15,
      fill: new ht({ color: "rgba(236, 248, 255, 0.86)" }),
      stroke: new lt({ color: t, width: 1 })
    }),
    text: new Ee({
      font: "14px Calibri,sans-serif",
      text: "M3",
      // Use the 'name' property for the label
      fill: new ht({ color: "#000" }),
      stroke: new lt({ color: "#fff", width: 3 }),
      offsetY: -15
    })
  });
}
const eg = function(n) {
  return Qf(n);
};
function Fl(n) {
  const t = n.get("data"), e = n.get("coord");
  return `
    <p class="p-0 m-0">Module Name: ${n.get("module_name")}</p>

    <p class="p-0 m-0">Longitude: ${e.lon}</p>

    <p class="p-0 m-0">Latitude: ${e.lat}</p>

    <p class="p-0 m-0">CO: ${t.trace_gases.co}mg/m³</p>

    <p class="p-0 m-0">CO2: ${t.trace_gases.co2}ppm</p>

    <p class="p-0 m-0">SO2: ${t.trace_gases.so2}µg/m³</p>

    <p class="p-0 m-0">NO2: ${t.trace_gases.no2}µg/m³</p>

    <p class="p-0 m-0">O3: ${t.trace_gases.o3}µg/m³</p>

    <p class="p-0 m-0">Black Carbon: ${t.black_carbon}µg/m³</p>

    <p class="p-0 m-0">Aerosols: ${t.aerosols}µg/m³</p>

    <p class="p-0 m-0">Battery Voltage: ${t.battery_voltage}V</p>
    `;
}
function ig(n) {
  let t = document.getElementById("selected-sensor-data"), e = document.createElement("h2"), i = document.createElement("p"), s = document.createElement("div");
  t.innerHTML = "", e.textContent = "Sensor Data", i.textContent = "Sensor Name: " + n.get("sensor_name"), s.innerHTML = Fl(n), t.append(e, i, s);
}
function ng(n, t) {
  return {
    coord: {
      lon: n,
      lat: t
    },
    sensor_name: "Water Level Temperature Sensor",
    module_name: "Modul 1",
    data: {
      water_level: 10,
      water_temperature: 10,
      battery_voltage: 10
    }
  };
}
const sg = [
  await ng(9.437341519465765, 54.793050186514364)
  // await createSensorData(9.4295, 54.802),
  // await createSensorData(9.542039207249285, 54.51069732199451), // Schleswig Schloss
  // await createSensorData(9.71559392307798, 54.52414462677734), // Missunde
  // await createSensorData(9.934568072662614, 54.66034130282637), // Kappeln
  // await createSensorData(9.868234526079595, 54.47305515348609), // Eckernförde
  // await createSensorData(10.133823712178105, 54.31114321214153), // Kiel Querkai
  // await createSensorData(10.17132953616414, 54.329012329712754), // Kiel Schwentine Werft
  // await createSensorData(10.216554343991787, 54.4042499260097), // Kiel Laboe
  // await createSensorData(9.711172066706121, 54.313332929813754), // Rendsburg
  // await createSensorData(9.126408784000207, 53.88780618582467), // Brunsbüttel
  // await createSensorData(10.980480508401266, 54.375842855573865), // Heiligenhafen
  // await createSensorData(11.19104586109911, 54.51394399850085), // Fehmarn
  // await createSensorData(8.296229935540385, 54.909481414684905), // Westerland
  // await createSensorData(8.694068755148862, 54.73080963743536), // Dagebüll
  // await createSensorData(8.815529667066356, 54.48633428418012), // Nordstrand
  // await createSensorData(8.58397921359508, 54.324191810957615), // Sankt Peter Ording
  // await createSensorData(8.849777321827073, 54.12813503606), // Büsum
  // await createSensorData( 9.591076207849072, 54.845860511473575), // Bockholm
];
function rg(n) {
  return n.get("data"), new rt({
    image: new qt({
      radius: 15,
      fill: new ht({ color: "rgba(0, 153, 255, 0.5)" }),
      stroke: new lt({ color: "#0066cc", width: 1 })
    }),
    text: new Ee({
      font: "14px Calibri,sans-serif",
      text: "M1",
      // Use the 'name' property for the label
      fill: new ht({ color: "#000" }),
      stroke: new lt({ color: "#fff", width: 3 }),
      offsetY: -15
    })
  });
}
function og(n, t) {
  return n.get("data"), new rt({
    image: new qt({
      radius: 15,
      fill: new ht({ color: "rgba(0, 153, 255, 0.5)" }),
      stroke: new lt({ color: t, width: 1 })
    }),
    text: new Ee({
      font: "14px Calibri,sans-serif",
      text: "M1",
      // Use the 'name' property for the label
      fill: new ht({ color: "#000" }),
      stroke: new lt({ color: "#fff", width: 3 }),
      offsetY: -15
    })
  });
}
const ag = function(n) {
  return rg(n);
};
function kl(n) {
  const t = n.get("data"), e = n.get("coord");
  return `
    <p class="p-0 m-0">Module Name: ${n.get("module_name")}</p>

    <p class="p-0 m-0">Longitude: ${e.lon}</p>

    <p class="p-0 m-0">Latitude: ${e.lat}</p>

    <p class="p-0 m-0">Water Level: ${t.water_level}m</p>

    <p class="p-0 m-0">Water Temperature: ${t.water_temperature}°C</p>

    <p class="p-0 m-0">Battery Voltage: ${t.battery_voltage}V</p>
    `;
}
function lg(n) {
  let t = document.getElementById("selected-sensor-data"), e = document.createElement("h2"), i = document.createElement("p"), s = document.createElement("div");
  t.innerHTML = "", e.textContent = "Sensor Data", i.textContent = "Sensor Name: " + n.get("sensor_name"), s.innerHTML = kl(n), t.append(e, i, s);
}
function Js(n, t, e, i, s) {
  const r = e.coordinate;
  n.setPosition(r), Nl(t), new bootstrap.Popover(t, {
    animation: !0,
    container: t,
    content: s,
    html: !0,
    placement: "top",
    title: i.get("sensor_name")
  }).show();
}
function Nl(n) {
  let t = bootstrap.Popover.getInstance(n);
  t && t.dispose();
}
const ua = document.querySelectorAll(".sidebar > .maps > input[type=radio]");
function hg(n) {
  return ua.forEach((t) => {
    t.addEventListener("change", function() {
      let e = this.value;
      n.getLayers().forEach(function(i, s, r) {
        let o = i.get("title");
        i instanceof kn && i.setVisible(o === e);
      });
    });
  }), ua;
}
const da = document.querySelectorAll(".sidebar > .filter > input[type=checkbox]");
function cg(n) {
  return da.forEach((t) => {
    t.addEventListener("change", function() {
      let e = this.value, i = this.checked;
      n.getLayers().forEach(function(s, r, o) {
        let a = s.get("title");
        s instanceof $i && a === e && s.setVisible(i);
      });
    });
  }), da;
}
function ug(n) {
  if (n >= 40)
    return "rgba(252,3,3,0.3)";
  if (n >= 30)
    return "rgba(252,177,3,0.3)";
  if (n >= 20)
    return "rgba(192,252,3,0.3)";
  if (n >= 10)
    return "rgba(32, 252, 3,0.3)";
  if (n >= 0)
    return "rgba(3,148,252,0.3)";
}
function dg() {
  let n = document.createElement("p");
  return n.style.fontWeight = "bold", n.className = "temperature-overlay-tile", n;
}
function fg(n, t) {
  return n.textContent = `${t}°C`, n.style.backgroundColor = ug(t), n;
}
function gg() {
  let n = document.createElement("p");
  return n.style.margin = "0", n.style.textAlign = "center", n.style.fontSize = "50px", n.textContent = "→", n.style.fontWeight = "bold", n;
}
function _g(n, t) {
  return n.style.rotate = `${t + 90}deg`, n;
}
function mg(n, t, e) {
  let i = e.getBoundingClientRect();
  const s = n.getCoordinateFromPixel([i.x, i.y]);
  let r = ka(s);
  return t.getClosestFeatureToCoordinate(Tr(r));
}
function Qn(n, t, e, i, s, r) {
  e.innerHTML = "";
  let o = document.createElement("div");
  o.classeName = "row", e.append(o);
  for (let a = 0; a < s; a++) {
    let l = document.createElement("div");
    l.className = "col d-flex align-items-center", o.append(l);
    for (let c = 0; c < i; c++) {
      let h;
      switch (r) {
        case "Temperature":
          h = dg();
          break;
        case "WindDirection":
          h = gg();
          break;
      }
      h.style.width = `${e.getBoundingClientRect().width / i}px`, h.style.height = `${e.getBoundingClientRect().height / s}px`, l.append(h);
      let u = mg(n, t, h);
      switch (r) {
        case "Temperature":
          h = fg(h, u.get("data").air_temperature);
          break;
        case "WindDirection":
          h = _g(h, u.get("data").wind_direction);
          break;
      }
    }
  }
}
const Wt = new pd({
  layers: [
    new kn({
      source: new qs(),
      visible: !0,
      title: "OSMStandard"
    }),
    new kn({
      source: new qs({
        url: "https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
      }),
      visible: !1,
      title: "OSMHumanitarian"
    }),
    new kn({
      source: new qs({
        url: "https://{a-c}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
      }),
      visible: !1,
      title: "OSMCyclosm"
    }),
    new $i({
      source: dn,
      visible: !0,
      title: "AirProperties",
      style: Hf
    }),
    new $i({
      source: gr(Jf),
      visible: !0,
      title: "AirQuality",
      style: eg
    }),
    new $i({
      source: gr(sg),
      visible: !0,
      title: "WaterLevelTemperature",
      style: ag
    })
  ],
  target: "map",
  view: new ee({
    center: Tr([9.432, 54.798]),
    zoom: 10
  })
});
hg(Wt);
cg(Wt);
const qi = new Bf({
  element: document.getElementById("popup")
}), Fn = qi.getElement();
Wt.addOverlay(qi);
const Nn = document.getElementById("temperature-overlay"), Gn = document.getElementById("wind-direction-overlay"), pg = xg(Nn), yg = wg(Gn), Eg = new $r({
  condition: Ja,
  style: function(n) {
    let t = "#D3AF37", e = new rt();
    switch (n.get("module_name")) {
      case "Modul 1":
        e = og(n, t);
        break;
      case "Modul 2":
        e = jf(n, t);
        break;
      case "Modul 3":
        e = tg(n, t);
        break;
    }
    return e;
  }
});
Wt.addInteraction(Eg);
Wt.on("click", function(n) {
  if (!Wt.forEachFeatureAtPixel(n.pixel, function(e) {
    switch (e.get("sensor_name")) {
      case "Air Properties Sensor":
        $f(e), Js(qi, Fn, n, e, Dl(e));
        break;
      case "Air Quality Sensor":
        ig(e), Js(qi, Fn, n, e, Fl(e));
        break;
      case "Water Level Temperature Sensor":
        lg(e), Js(qi, Fn, n, e, kl(e));
        break;
    }
    return e;
  })) {
    Nl(Fn);
    const e = n.coordinate, i = ka(e);
    console.log(i);
  }
});
Wt.on("moveend", function() {
  console.log("View has changed"), pg.checked ? (Nn.style.display = "", Qn(Wt, dn, Nn, 10, 10, "Temperature")) : Nn.style.display = "none", yg.checked ? (Gn.style.display = "", Qn(Wt, dn, Gn, 10, 10, "WindDirection")) : Gn.style.display = "none", Wt.render();
});
function xg(n) {
  const t = document.getElementById("temperatureCheckbox");
  return t.addEventListener("change", function() {
    t.checked ? (n.style.display = "", Qn(Wt, dn, n, 10, 10, "Temperature")) : n.style.display = "none";
  }), t;
}
function wg(n) {
  const t = document.getElementById("windDirectionCheckbox");
  return t.addEventListener("change", function() {
    t.checked ? (n.style.display = "", Qn(Wt, dn, n, 10, 10, "WindDirection")) : n.style.display = "none";
  }), t;
}
export {
  Wt as map
};
//# sourceMappingURL=map-project.js.map
