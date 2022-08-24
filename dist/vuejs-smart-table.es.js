import { reactive, computed, watch, defineComponent, provide, toRef, h, inject, ref, onMounted, nextTick, isVue2, install } from "vue-demi";
var SortOrder = /* @__PURE__ */ ((SortOrder2) => {
  SortOrder2[SortOrder2["DESC"] = -1] = "DESC";
  SortOrder2[SortOrder2["NONE"] = 0] = "NONE";
  SortOrder2[SortOrder2["ASC"] = 1] = "ASC";
  return SortOrder2;
})(SortOrder || {});
function getPropertyValue(object, keyPath) {
  keyPath = keyPath.replace(/\[(\w+)\]/g, ".$1");
  keyPath = keyPath.replace(/^\./, "");
  const keys = keyPath.split(".");
  let copy = object;
  for (const key of keys) {
    if (key in copy) {
      copy = copy[key];
    } else {
      return;
    }
  }
  return copy;
}
function isNumeric(toCheck) {
  return !Array.isArray(toCheck) && !isNaN(parseFloat(toCheck)) && isFinite(toCheck);
}
function doSort(toSort, sortKey, customSort, sortOrder) {
  const local = [...toSort];
  return local.sort((a, b) => {
    if (typeof customSort === "function") {
      return customSort(a, b, sortOrder);
    }
    let val1;
    let val2;
    if (!sortKey) {
      val1 = null;
      val2 = null;
    } else if (typeof sortKey === "function") {
      val1 = sortKey(a, sortOrder);
      val2 = sortKey(b, sortOrder);
    } else {
      val1 = getPropertyValue(a, sortKey);
      val2 = getPropertyValue(b, sortKey);
    }
    if (val1 === null || val1 === void 0)
      val1 = "";
    if (val2 === null || val2 === void 0)
      val2 = "";
    if (isNumeric(val1) && isNumeric(val2)) {
      return (val1 - val2) * sortOrder;
    }
    const str1 = val1.toString();
    const str2 = val2.toString();
    return str1.localeCompare(str2) * sortOrder;
  });
}
function isBasicFilter(filter) {
  return Array.isArray(filter.keys);
}
function isCustomFilter(filter) {
  return filter && typeof filter.custom === "function";
}
function passFilter(item, filter) {
  if (isCustomFilter(filter) && !filter.custom(filter.value, item)) {
    return false;
  }
  if (!isBasicFilter(filter) || filter.value === null || filter.value === void 0 || filter.value.length === 0) {
    return true;
  }
  for (const key of filter.keys) {
    const value = getPropertyValue(item, key);
    if (value !== null && value !== void 0) {
      const filterStrings = Array.isArray(filter.value) ? filter.value : [filter.value];
      for (const filterString of filterStrings) {
        if (filter.exact) {
          if (value.toString() === filterString.toString()) {
            return true;
          }
        } else {
          if (value.toString().toLowerCase().includes(filterString.toString().toLowerCase())) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function doFilter(toFilter, filters) {
  const filteredData = [];
  for (const item of toFilter) {
    let passed = true;
    for (const filterName of Object.keys(filters)) {
      const filter = filters[filterName];
      if (!passFilter(item, filter)) {
        passed = false;
        break;
      }
    }
    if (passed) {
      filteredData.push(item);
    }
  }
  return filteredData;
}
function doPaginate(toPaginate, pageSize, currentPage) {
  if (toPaginate.length <= pageSize || pageSize <= 0 || currentPage <= 0) {
    return toPaginate;
  }
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return [...toPaginate].slice(start, end);
}
function calculateTotalPages(totalItems, pageSize) {
  return totalItems <= pageSize ? 1 : Math.ceil(totalItems / pageSize);
}
function uuid() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
class Store {
  constructor(emitFn) {
    this.state = reactive({
      data: [],
      filters: {},
      selectedRows: [],
      selectionMode: "single",
      selectOnClick: true,
      selectedClass: "",
      hideSortIcons: false,
      sortId: null,
      sortKey: null,
      customSort: null,
      sortOrder: SortOrder.NONE,
      currentPage: 0,
      pageSize: void 0,
      sortIconPosition: "after",
      sortHeaderClass: ""
    });
    this.emit = emitFn;
    this.filteredData = computed(() => {
      if (this.state.data.length === 0) {
        return [];
      }
      if (Object.keys(this.state.filters).length === 0) {
        return this.state.data;
      }
      return doFilter(this.state.data, this.state.filters);
    });
    this.sortedData = computed(() => {
      if ((this.state.sortKey || this.state.customSort) && this.state.sortOrder !== 0) {
        return doSort(this.filteredData.value, this.state.sortKey, this.state.customSort, this.state.sortOrder);
      }
      return this.filteredData.value;
    });
    this.totalItems = computed(() => this.filteredData.value.length);
    this.totalPages = computed(() => {
      if (!this.state.pageSize)
        return 0;
      return calculateTotalPages(this.totalItems.value, this.state.pageSize);
    });
    watch(this.totalPages, (totalPages) => {
      this.emit("totalPagesChanged", totalPages);
    }, { immediate: true });
    this.paginationEnabled = computed(() => this.state.pageSize);
    const needsPaginationReset = computed(() => this.paginationEnabled.value && this.state.currentPage > this.totalPages.value);
    watch(needsPaginationReset, (needsReset) => {
      if (needsReset && this.paginationEnabled.value) {
        this.state.currentPage = 1;
        this.emit("update:currentPage", this.state.currentPage);
      }
    });
    this.displayData = computed(() => {
      if (this.paginationEnabled.value) {
        return doPaginate(this.sortedData.value, this.state.pageSize, this.state.currentPage);
      }
      return this.sortedData.value;
    });
    watch(this.displayData, (data) => {
      this.emit("totalItemsChanged", data.length);
    });
    this.tableState = computed(() => ({
      rows: this.displayData.value,
      rowsPrePagination: this.sortedData.value,
      selectedRows: this.state.selectedRows
    }));
    watch(this.tableState, (state) => {
      this.emit("stateChanged", state);
    }, { immediate: true, deep: true });
  }
  revealItem(item) {
    if (!this.paginationEnabled.value) {
      return false;
    }
    let index;
    if (typeof item === "function") {
      index = this.sortedData.value.findIndex(item);
    } else {
      index = this.sortedData.value.indexOf(item);
    }
    if (index === -1) {
      return false;
    }
    this.emit("update:currentPage", Math.ceil((index + 1) / this.state.pageSize));
    return true;
  }
  selectRow(row) {
    if (this.state.selectionMode === "single") {
      this.state.selectedRows = [row];
      return;
    }
    if (!this.state.selectedRows.includes(row)) {
      this.state.selectedRows.push(row);
    }
  }
  selectRows(rows) {
    for (const row of rows) {
      this.selectRow(row);
    }
  }
  deselectRow(row) {
    const index = this.state.selectedRows.indexOf(row);
    if (index > -1) {
      this.state.selectedRows.splice(index, 1);
    }
  }
  deselectRows(rows) {
    for (const row of rows) {
      this.deselectRow(row);
    }
  }
  selectAll() {
    if (this.state.selectionMode === "single") {
      return;
    }
    this.state.selectedRows = [...this.state.data];
  }
  deselectAll() {
    this.state.selectedRows = [];
  }
  setSort({ sortKey, customSort, sortOrder, sortId }) {
    this.state.sortKey = sortKey;
    this.state.customSort = customSort;
    this.state.sortOrder = sortOrder;
    this.state.sortId = sortId;
  }
  syncProp(key, reference, deep = false) {
    watch(reference, () => {
      this.state[key] = reference.value;
    }, { immediate: true, deep });
  }
}
const storeKey = Symbol("store-key");
var VTable = defineComponent({
  name: "VTable",
  props: {
    data: {
      type: Array,
      required: true
    },
    filters: {
      type: Object,
      required: false,
      default: () => ({})
    },
    currentPage: {
      type: Number,
      required: false,
      default: void 0
    },
    pageSize: {
      type: Number,
      required: false,
      default: void 0
    },
    selectionMode: {
      type: String,
      required: false,
      default: "single",
      validator: (val) => ["single", "multiple"].includes(val)
    },
    selectedClass: {
      required: false,
      type: String,
      default: "vt-selected"
    },
    selectOnClick: {
      required: false,
      type: Boolean,
      default: true
    },
    hideSortIcons: {
      required: false,
      type: Boolean,
      default: false
    },
    sortIconPosition: {
      required: false,
      type: String,
      default: "after"
    },
    sortHeaderClass: {
      type: String,
      required: false,
      default: ""
    }
  },
  emits: {
    stateChanged: (state) => true,
    totalPagesChanged: (pages) => true,
    totalItemsChanged: (pages) => true
  },
  setup(props, ctx) {
    const store = new Store(ctx.emit);
    provide(storeKey, store);
    store.syncProp("data", toRef(props, "data"));
    store.syncProp("filters", toRef(props, "filters"), true);
    store.syncProp("currentPage", toRef(props, "currentPage"));
    store.syncProp("pageSize", toRef(props, "pageSize"));
    store.syncProp("selectionMode", toRef(props, "selectionMode"));
    store.syncProp("selectedClass", toRef(props, "selectedClass"));
    store.syncProp("selectOnClick", toRef(props, "selectOnClick"));
    store.syncProp("hideSortIcons", toRef(props, "hideSortIcons"));
    store.syncProp("sortIconPosition", toRef(props, "sortIconPosition"));
    store.syncProp("sortHeaderClass", toRef(props, "sortHeaderClass"));
    const allRowsSelected = computed(() => store.state.selectedRows.length === store.state.data.length);
    const toggleAllRows = () => allRowsSelected.value ? store.deselectAll() : store.selectAll();
    return {
      store,
      tableState: store.tableState,
      allRowsSelected,
      toggleAllRows,
      selectAll: () => store.selectAll(),
      deselectAll: () => store.deselectAll(),
      selectRows: (rows) => store.selectRows(rows),
      selectRow: (row) => store.selectRow(row),
      deselectRows: (rows) => store.deselectRows(rows),
      deselectRow: (row) => store.deselectRow(row),
      revealItem: (item) => store.revealItem(item),
      slots: ctx.slots
    };
  },
  render() {
    return h("table", {
      class: "v-table"
    }, [
      h("thead", this.slots.head ? this.slots.head({
        rows: this.tableState.rows,
        selectedRows: this.tableState.selectedRows,
        toggleAllRows: this.toggleAllRows,
        selectAll: this.selectAll,
        deselectAll: this.deselectAll,
        allRowsSelected: this.allRowsSelected
      }) : void 0),
      h("tbody", this.slots.body ? this.slots.body({
        rows: this.tableState.rows,
        selectedRows: this.tableState.selectedRows,
        selectRow: this.selectRow,
        deselectRow: this.deselectRow
      }) : void 0),
      h("tfoot", this.slots.foot ? this.slots.foot({
        rows: this.tableState.rows,
        selectedRows: this.tableState.selectedRows,
        toggleAllRows: this.toggleAllRows,
        selectAll: this.selectAll,
        deselectAll: this.deselectAll,
        allRowsSelected: this.allRowsSelected
      }) : void 0)
    ]);
  }
});
function createIcon(props) {
  var _a;
  const svgAttrs = {
    width: 16,
    height: 16,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 ${props.vbWidth} ${props.vbHeight}`
  };
  const pathAttrs = {
    fill: "currentColor",
    d: props.d,
    opacity: (_a = props.opacity) != null ? _a : 1
  };
  return h(
    "svg",
    {
      attrs: svgAttrs,
      ...svgAttrs,
      style: {
        ...props.disabled ? { color: "#9CA3AF" } : {}
      }
    },
    [h("path", {
      attrs: pathAttrs,
      ...pathAttrs
    })]
  );
}
function createSortIcon(order) {
  const svgAttrs = {
    width: 16,
    height: 16,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: `0 0 320 512`
  };
  const upAttrs = () => ({
    fill: "currentColor",
    opacity: order === SortOrder.NONE ? 0.4 : order === SortOrder.ASC ? 0.4 : 1,
    d: "M41.05 288.05h238c21.4 0 32.1 25.9 17 41l-119 119a23.9 23.9 0 0 1-33.8.1l-.1-.1-119.1-119c-15.05-15.05-4.4-41 17-41z"
  });
  const downAttrs = () => ({
    fill: "currentColor",
    opacity: order === SortOrder.NONE ? 0.4 : order === SortOrder.DESC ? 0.4 : 1,
    d: "M24.05 183.05l119.1-119A23.9 23.9 0 0 1 177 64a.94.94 0 0 1 .1.1l119 119c15.1 15.1 4.4 41-17 41h-238c-21.45-.05-32.1-25.95-17.05-41.05z"
  });
  return h(
    "svg",
    {
      attrs: svgAttrs,
      ...svgAttrs
    },
    [h("g", [
      h("path", {
        attrs: upAttrs(),
        ...upAttrs()
      }),
      h("path", {
        attrs: downAttrs(),
        ...downAttrs()
      })
    ])]
  );
}
var VTh = defineComponent({
  name: "VTh",
  props: {
    sortKey: {
      type: [String, Function],
      required: false,
      default: null
    },
    customSort: {
      type: [Function, Object],
      required: false,
      default: null
    },
    defaultSort: {
      type: String,
      required: false,
      validator: (value) => ["asc", "desc", null].includes(value),
      default: null
    }
  },
  emits: ["defaultSort", "sortChanged"],
  setup(props, { emit, slots }) {
    const store = inject(storeKey);
    if (!props.sortKey && !props.customSort) {
      throw new Error("Must provide the Sort Key value or a Custom Sort function.");
    }
    const id = uuid();
    const order = ref(SortOrder.NONE);
    onMounted(() => {
      if (props.defaultSort) {
        order.value = props.defaultSort === "desc" ? SortOrder.DESC : SortOrder.ASC;
        store.setSort({
          sortOrder: order.value,
          sortKey: props.sortKey,
          customSort: props.customSort,
          sortId: id
        });
        nextTick(() => {
          emit("defaultSort");
          emit("sortChanged", { sortOrder: order.value });
        });
      }
    });
    const sortIcon = computed(() => {
      if (store.state.hideSortIcons) {
        return;
      }
      return createSortIcon(order.value);
    });
    watch(() => store.state.sortId, () => {
      if (store.state.sortId !== id && order.value !== 0) {
        order.value = 0;
      }
    });
    const sort = () => {
      if ([SortOrder.DESC, SortOrder.NONE].includes(order.value)) {
        order.value = SortOrder.ASC;
      } else {
        order.value = SortOrder.DESC;
      }
      store.setSort({
        sortOrder: order.value,
        sortKey: props.sortKey,
        customSort: props.customSort,
        sortId: id
      });
      emit("sortChanged", { sortOrder: order.value });
    };
    const children = computed(() => {
      const children2 = [];
      if (store.state.sortIconPosition === "before" && !store.state.hideSortIcons) {
        children2.push(sortIcon.value);
      }
      if (slots.default) {
        children2.push(h("span", [slots.default({ sortOrder: order.value })]));
      }
      if (store.state.sortIconPosition === "after" && !store.state.hideSortIcons) {
        children2.push(sortIcon.value);
      }
      return children2;
    });
    return () => {
      return h("th", {
        class: "v-th",
        ...isVue2 ? {
          on: {
            click: sort
          }
        } : {
          onClick: sort
        }
      }, [
        h("div", { class: store.state.sortHeaderClass }, children.value)
      ]);
    };
  }
});
var VTr = defineComponent({
  name: "VTr",
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  setup(props, { slots }) {
    const store = inject(storeKey);
    const isSelected = computed(() => store.state.selectedRows.find((it) => it === props.row));
    const rowClass = computed(() => isSelected.value ? store.state.selectedClass : "");
    const style = computed(() => ({ ...store.state.selectOnClick ? { cursor: "pointer" } : {} }));
    const handleRowSelected = (event) => {
      const source = event.target;
      if (source && source.tagName.toLowerCase() === "td") {
        if (isSelected.value) {
          store.deselectRow(props.row);
        } else {
          store.selectRow(props.row);
        }
      }
    };
    return () => {
      return h(
        "tr",
        {
          class: rowClass.value,
          style: style.value,
          ...store.state.selectOnClick ? { onClick: handleRowSelected } : {},
          on: {
            ...store.state.selectOnClick ? { click: handleRowSelected } : {}
          }
        },
        slots.default ? slots.default({
          isSelected: isSelected.value,
          toggle: () => isSelected.value ? store.deselectRow(props.row) : store.selectRow(props.row)
        }) : []
      );
    };
  }
});
var VTPagination = defineComponent({
  name: "VTPagination",
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    hideSinglePage: {
      required: false,
      type: Boolean,
      default: true
    },
    maxPageLinks: {
      required: false,
      type: Number,
      default: NaN
    },
    boundaryLinks: {
      required: false,
      type: Boolean,
      default: false
    },
    directionLinks: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  setup(props, { slots, emit }) {
    const getAllPages = () => {
      const allPages = [];
      for (let i = 1; i <= props.totalPages; i++) {
        allPages.push({
          title: i.toString(),
          value: i
        });
      }
      return allPages;
    };
    const getLimitedPages = () => {
      const displayPages2 = [];
      const totalTiers = Math.ceil(props.totalPages / props.maxPageLinks);
      const activeTier = Math.ceil((props.currentPage || 1) / props.maxPageLinks);
      let start = (activeTier - 1) * props.maxPageLinks + 1;
      const end = Math.min(start + props.maxPageLinks - 1, props.totalPages);
      const totalEntries = end - start + 1;
      const missingAmount = props.maxPageLinks - totalEntries;
      const isLastTier = activeTier === totalTiers && activeTier > 1;
      if (isLastTier && missingAmount > 0) {
        start = start - missingAmount;
      }
      if (activeTier > 1) {
        displayPages2.push({
          title: "...",
          value: start - 1
        });
      }
      for (let i = start; i <= end; i++) {
        if (i > props.totalPages) {
          break;
        }
        displayPages2.push({
          title: i.toString(),
          value: i
        });
      }
      if (activeTier < totalTiers) {
        displayPages2.push({
          title: "...",
          value: end + 1
        });
      }
      return displayPages2;
    };
    const displayPages = computed(() => {
      if (isNaN(props.maxPageLinks) || props.maxPageLinks <= 0) {
        return getAllPages();
      } else {
        return getLimitedPages();
      }
    });
    const selectPage = (page) => {
      if (page < 1 || page > props.totalPages || page === props.currentPage) {
        return;
      }
      emit("update:currentPage", page);
    };
    const nextPage = () => {
      if (!props.currentPage) {
        emit("update:currentPage", 1);
      } else if (props.currentPage < props.totalPages) {
        emit("update:currentPage", props.currentPage + 1);
      }
    };
    const previousPage = () => {
      if (!props.currentPage) {
        emit("update:currentPage", 1);
      } else if (props.currentPage > 1) {
        emit("update:currentPage", props.currentPage - 1);
      }
    };
    const firstPage = () => {
      emit("update:currentPage", 1);
    };
    const lastPage = () => {
      emit("update:currentPage", props.totalPages);
    };
    const creteListItem = (children, onClick, disabled, active = false) => {
      return h(
        "li",
        {
          class: ["page-item", { disabled, active }]
        },
        [h(
          "a",
          {
            class: "page-link",
            style: {
              ...disabled ? { cursor: "not-allowed" } : {}
            },
            attrs: {
              href: "javascript:void(0)"
            },
            href: "javascript:void(0)",
            ...disabled ? {} : { onClick },
            on: {
              ...disabled ? {} : { click: onClick }
            }
          },
          [children]
        )]
      );
    };
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      if (props.hideSinglePage && props.totalPages === 1) {
        return h("");
      }
      const listItems = [];
      if (props.boundaryLinks) {
        const firstPageIcon = createIcon({
          vbWidth: 512,
          vbHeight: 512,
          d: "M34.5 239L228.9 44.7c9.4-9.4 24.6-9.4 33.9 0l22.7 22.7c9.4 9.4 9.4 24.5 0 33.9L131.5 256l154 154.7c9.3 9.4 9.3 24.5 0 33.9l-22.7 22.7c-9.4 9.4-24.6 9.4-33.9 0L34.5 273c-9.3-9.4-9.3-24.6 0-34zm192 34l194.3 194.3c9.4 9.4 24.6 9.4 33.9 0l22.7-22.7c9.4-9.4 9.4-24.5 0-33.9L323.5 256l154-154.7c9.3-9.4 9.3-24.5 0-33.9l-22.7-22.7c-9.4-9.4-24.6-9.4-33.9 0L226.5 239c-9.3 9.4-9.3 24.6 0 34z"
        });
        const disabled = props.currentPage === 1;
        const firstPageSlot = (_b = (_a = slots.firstPage) == null ? void 0 : _a.call(slots, { disabled })) != null ? _b : firstPageIcon;
        listItems.push(creteListItem(firstPageSlot, firstPage, disabled));
      }
      if (props.directionLinks) {
        const previousIcon = createIcon({
          vbWidth: 320,
          vbHeight: 512,
          d: "M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"
        });
        const disabled = props.currentPage === 1;
        const previousSlot = (_d = (_c = slots.previous) == null ? void 0 : _c.call(slots, { disabled })) != null ? _d : previousIcon;
        listItems.push(creteListItem(previousSlot, previousPage, disabled));
      }
      for (const page of displayPages.value) {
        listItems.push(creteListItem(page.title, () => selectPage(page.value), false, page.value === props.currentPage));
      }
      if (props.directionLinks) {
        const nextIcon = createIcon({
          vbWidth: 320,
          vbHeight: 512,
          d: "M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
        });
        const disabled = props.currentPage === props.totalPages;
        const nextSlot = (_f = (_e = slots.next) == null ? void 0 : _e.call(slots, { disabled })) != null ? _f : nextIcon;
        listItems.push(creteListItem(nextSlot, nextPage, disabled));
      }
      if (props.boundaryLinks) {
        const lastPageIcon = createIcon({
          vbWidth: 512,
          vbHeight: 512,
          d: "M477.5 273L283.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9l154-154.7-154-154.7c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9 0L477.5 239c9.3 9.4 9.3 24.6 0 34zm-192-34L91.1 44.7c-9.4-9.4-24.6-9.4-33.9 0L34.5 67.4c-9.4 9.4-9.4 24.5 0 33.9l154 154.7-154 154.7c-9.3 9.4-9.3 24.5 0 33.9l22.7 22.7c9.4 9.4 24.6 9.4 33.9 0L285.5 273c9.3-9.4 9.3-24.6 0-34z"
        });
        const disabled = props.currentPage === props.totalPages;
        const firstPageSlot = (_h = (_g = slots.lastPage) == null ? void 0 : _g.call(slots, { disabled })) != null ? _h : lastPageIcon;
        listItems.push(creteListItem(firstPageSlot, lastPage, disabled));
      }
      return h("nav", { class: "vt-pagination" }, [
        h("ul", { class: "pagination" }, [listItems])
      ]);
    };
  }
});
install();
var main = {
  install(app, options = {}) {
    const props = ["hideSortIcons", "sortIconPosition", "sortHeaderClass"];
    props.forEach((it) => {
      if (options.hasOwnProperty(it)) {
        VTable.props[it].default = options[it];
      }
    });
    app.component("VTable", VTable);
    app.component("VTh", VTh);
    app.component("VTr", VTr);
    app.component("VTPagination", VTPagination);
  }
};
export { main as default };
