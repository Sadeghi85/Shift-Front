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
      require("unplugin-auto-import/webpack")({
        // targets to transform
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/, // .md
        ],

        // global imports to register
        imports: [
          // presets
          "vue",
          "vue-router",
          "@vueuse/core",
          "vue-i18n",
          // custom
          {
            // "@vueuse/core": [
            //   // named imports
            //   "useMouse", // import { useMouse } from '@vueuse/core',
            //   // alias
            //   ["useFetch", "useMyFetch"], // import { useFetch as useMyFetch } from '@vueuse/core',
            // ],
            // axios: [
            //   // default imports
            //   ["default", "axios"], // import { default as axios } from 'axios',
            // ],
            // "[package-name]": [
            //   "[import-names]",
            //   // alias
            //   ["[from]", "[alias]"],
            // ],
            uuid: [["v4", "uuidv4"]],
            "@vuelidate/core": ["useVuelidate"],
            "@vuelidate/validators": [
              "required",
              "numeric",
              "requiredUnless",
              "maxLength",
            ],
            "primevue/usetoast": ["useToast"],
            "primevue/useconfirm": ["useConfirm"],
            "primevue/api": ["FilterMatchMode"],
            "@casl/vue": ["useAbility"],
            axios: ["AxiosResponse"],

            "@/services/PortalService": ["PortalService"],
            "@/services/ShiftDefinitionService": ["ShiftDefinitionService"],
            "@/services/JobService": ["JobService"],
            "@/services/ShiftDefinitionTemplateService": [
              "ShiftDefinitionTemplateService",
            ],
            "@/services/LocationService": ["LocationService"],
            "@/services/PortalLocationService": ["PortalLocationService"],
            "@/services/ShiftTabletService": ["ShiftTabletService"],
            "@/services/ShiftTabletCrewService": ["ShiftTabletCrewService"],
            "@/services/AgentService": ["AgentService"],
            "@/services/ShiftTabletReportService": ["ShiftTabletReportService"],
            "@/services/ShiftTabletConductorChangeService": [
              "ShiftTabletConductorChangeService",
            ],
            "@/services/ShiftTabletReviewProblemService": [
              "ShiftTabletReviewProblemService",
            ],
            "@/services/ReportService": ["ReportService"],
            "@/services/MonetarySettingService": ["MonetarySettingService"],
            "@/services/CooperationTypeService": ["CooperationTypeService"],
            "@/services/PaymentService": ["PaymentService"],

            "@/models/ApiResponseModel": ["IApiResponseModel"],
            "@/models/PortalModels": ["PortalViewModel", "PortalSearchModel"],
            "@/models/AgentModels": ["AgentViewModel", "AgentSearchModel"],
            "@/models/ShiftDefinitionModels": [
              "ShiftDefinitionViewModel",
              "ShiftDefinitionInputModel",
              "ShiftDefinitionSearchModel",
            ],
            "@/models/ShiftTypeModels": ["ShiftTypeViewModel"],
            "@/models/JobModels": ["JobViewModel", "JobSearchModel"],
            "@/models/ShiftDefinitionTemplateModels": [
              "ShiftDefinitionTemplateInputModel",
              "ShiftDefinitionTemplateSearchModel",
              "ShiftDefinitionTemplateViewModel",
            ],
            "@/models/LocationModels": [
              "LocationViewModel",
              "LocationInputModel",
              "LocationSearchModel",
            ],
            "@/models/PortalLocationModels": [
              "PortalLocationViewModel",
              "PortalLocationInputModel",
              "PortalLocationSearchModel",
            ],
            "@/models/ShiftTabletModels": [
              "ShiftTabletViewModel",
              "ShiftTabletCreateModel",
              "ShiftTabletUpdateModel",
              "ShiftTabletSearchModel",
            ],
            "@/models/ShiftTabletCrewModels": [
              "ShiftTabletCrewViewModel",
              "ShiftTabletCrewInputModel",
              "ShiftTabletCrewSearchModel",
            ],
            "@/models/ShiftTabletReportModels": [
              "ShiftTabletReportViewModel",
              "ShiftTabletReportInputModel",
              "ShiftTabletReportSearchModel",
            ],
            "@/models/ShiftTabletConductorChangeModels": [
              "ShiftTabletConductorChangeViewModel",
              "ShiftTabletConductorChangeInputModel",
              "ShiftTabletConductorChangeSearchModel",
            ],
            "@/models/ShiftTabletReviewProblemModels": [
              "ShiftTabletReviewProblemViewModel",
              "ShiftTabletReviewProblemInputModel",
              "ShiftTabletReviewProblemSearchModel",
            ],
            "@/models/MonetarySettingModels": [
              "MonetarySettingViewModel",
              "MonetarySettingInputModel",
              "MonetarySettingSearchModel",
            ],
            "@/models/CooperationTypeModels": [
              "CooperationTypeViewModel",
              "CooperationTypeInputModel",
              "CooperationTypeSearchModel",
            ],
            "@/models/PaymentModels": [
              "PaymentViewModel",
              "PaymentInputModel",
              "PaymentSearchModel",
            ],
          },
        ],

        // Auto import for all module exports under directories
        dirs: [
          // './hooks',
          // './composables'
          // ...
        ],

        // Filepath to generate corresponding .d.ts file.
        // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
        // Set `false` to disable.
        dts: "./auto-imports.d.ts",

        // Auto import inside Vue template
        // see https://github.com/unjs/unimport/pull/15 and https://github.com/unjs/unimport/pull/72
        vueTemplate: false,

        // Custom resolvers, compatible with `unplugin-vue-components`
        // see https://github.com/antfu/unplugin-auto-import/pull/23/
        resolvers: [
          /* ... */
        ],

        // Generate corresponding .eslintrc-auto-import.json file.
        // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
        eslintrc: {
          enabled: true, // Default `false`
          filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
          globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
        },
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
            "rtcookie=rui=1krFREj/0UVuMnfxv3FLR5+EuKVYbVwWTWo1TPx4PZixdlaVvdSC4cceLfenXeieq6nGa1F09US7QMgXIbgEJhAi4OJCPoPWtb4RTEFwOkyxIDYjG9jb0g5yEAxNIaTy"
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
