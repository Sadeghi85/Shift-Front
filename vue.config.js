const components2 = [
  "Accordion",
  "AccordionTab",
  "AutoComplete",
  "Avatar",
  "AvatarGroup",
  "Badge",
  "BlockUI",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "CascadeSelect",
  "Chart",
  "Checkbox",
  "Chip",
  "Chips",
  "ColorPicker",
  "Column",
  "ColumnGroup",
  "ContextMenu",
  "DataTable",
  "DataView",
  "DataViewLayoutOptions",
  "DeferredContent",
  "Dialog",
  "Divider",
  "Dock",
  "Dropdown",
  "Editor",
  "Fieldset",
  "FileUpload",
  "FullCalendar",
  "Galleria",
  "Image",
  "InlineMessage",
  "Inplace",
  "InputMask",
  "InputNumber",
  "InputSwitch",
  "InputText",
  "Knob",
  "Listbox",
  "MegaMenu",
  "Menu",
  "Menubar",
  "Message",
  "MultiSelect",
  "OrderList",
  "OrganizationChart",
  "OverlayPanel",
  "Paginator",
  "Panel",
  "PanelMenu",
  "Password",
  "PickList",
  "ProgressBar",
  "ProgressSpinner",
  "RadioButton",
  "Rating",
  "ScrollPanel",
  "ScrollTop",
  "SelectButton",
  "Sidebar",
  "Skeleton",
  "Slider",
  "SpeedDial",
  "SplitButton",
  "Splitter",
  "SplitterPanel",
  "Steps",
  "TabMenu",
  "TabPanel",
  "TabView",
  "Tag",
  "Terminal",
  "TerminalService",
  "Textarea",
  "TieredMenu",
  "Timeline",
  "Timelist",
  "ToggleButton",
  "Toolbar",
  "Tree",
  "TreeSelect",
  "TreeTable",
  "TriStateCheckbox",
  "VirtualScroller",
  "Toast",
  "ConfirmDialog",
];
function PrimeVueResolver(options = {}) {
  return {
    type: "component",
    resolve: (name) => {
      const sideEffects = [];
      if (options.importStyle)
        sideEffects.push("primevue/resources/primevue.min.css");
      if (options.importIcons) sideEffects.push("primeicons/primeicons.css");
      if (options.importTheme) {
        sideEffects.push(
          `primevue/resources/themes/${options.importTheme}/theme.css`
        );
      }
      if (options.prefix) {
        if (!name.startsWith(options.prefix)) return;
        name = name.substring(options.prefix.length);
      }
      if (components2.includes(name)) {
        return {
          from: `primevue/${name.toLowerCase()}`,
          sideEffects,
        };
      }
    },
  };
}

const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
//const { PrimeVueResolver } = require("unplugin-vue-components/resolvers");
module.exports = defineConfig({
  configureWebpack: {
    // disable sourcemap files in production
    devtool: process.env.NODE_ENV === "production" ? false : "source-map",
    output: {
      devtoolModuleFilenameTemplate: (info) => {
        let $filename = "sources://" + info.resourcePath + "?" + info.hash;
        if (
          info.resourcePath.match(/\.vue$/) &&
          !info.query.match(/type=script/)
        ) {
          $filename =
            "webpack-generated:///" + info.resourcePath + "?" + info.hash;
        }
        return $filename;
      },
      devtoolFallbackModuleFilenameTemplate: (info) => {
        return "webpack:///" + info.resourcePath + "?" + info.hash;
      },
    },
    // experiments: {
    //   topLevelAwait: true,
    // },
    plugins: [
      // trim unnecessary locales from momentjs
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /fa/),
      new webpack.IgnorePlugin({
        resourceRegExp: new RegExp("/^./locale$/", "i"),
        contextRegExp: new RegExp("/moment$/", "i"),
      }),
      require("unplugin-vue-components/webpack")({
        // relative paths to the directory to search for components.
        dirs: ["src/components", "src/views"],

        // valid file extensions for components.
        extensions: ["vue"],
        // search for subdirectories
        deep: true,
        // resolvers for custom components
        resolvers: [PrimeVueResolver()],

        // generate `components.d.ts` global declarations,
        // also accepts a path for custom filename
        // default: `true` if package typescript is installed
        dts: true,

        // Allow subdirectories as namespace prefix for components.
        directoryAsNamespace: false,
        // Subdirectory paths for ignoring namespace prefixes
        // works when `directoryAsNamespace: true`
        globalNamespaces: [],

        // auto import for directives
        // default: `true` for Vue 3, `false` for Vue 2
        // Babel is needed to do the transformation for Vue 2, it's disabled by default for performance concerns.
        // To install Babel, run: `npm install -D @babel/parser`
        directives: true,

        // Transform path before resolving
        importPathTransform: (v) => v,

        // Allow for components to override other components with the same name
        allowOverrides: false,

        // filters for transforming targets
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [
          /[\\/]node_modules[\\/]/,
          /[\\/]\.git[\\/]/,
          /[\\/]\.nuxt[\\/]/,
        ],
      }),
    ],
  },
  devServer: {
    client: {
      webSocketURL: "ws://0.0.0.0:8080/ws",
    },
    allowedHosts: "all",

    proxy: {
      "^/GetToken": {
        target: "http://localhost:8825/WebService/PortalWebService.asmx",
        changeOrigin: true,
        onProxyReq: function (proxyReq) {
          proxyReq.setHeader(
            "Cookie",
            "rtcookie=rui=1krFREj/0UVuMnfxv3FLR5+EuKVYbVwWTWo1TPx4PZixdlaVvdSC4cceLfenXeieq6nGa1F09US7QMgXIbgEJlpMA+T4Wd4w3ogBGk4b64DHgR9myOQIarRIP8xsCOqe"
          );
        },
      },
    },
  },

  transpileDependencies: true,

  //filenameHashing: false,

  publicPath:
    process.env.NODE_ENV === "production" ? process.env.VUE_APP_BASE_URL : "/",
});
