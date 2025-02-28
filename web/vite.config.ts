import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
function rename() {
    return {
        name: 'rename', generateBundle: function (options, bundle, isWrite) {
            for (var key in bundle) {
                if (key.indexOf('?') != -1) {
                    var newkey = key.substring(0, key.indexOf('?'));
                    bundle[key].fileName = newkey;
                    console.log('rename: ', key, newkey);
                }
            }
        }
    };
};
// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    server: {
        proxy: {
            '/cgi-bin': {
                target: "http://192.168.2.1",
                changeOrigin: false,
                ws: true,
            },
        },
    },
    build: {
        target: "es2015",
        outDir: "dist",
        assetsDir: "",
        cssCodeSplit: false,
        assetsInlineLimit: 0,
        chunkSizeWarningLimit: 4096,
        rollupOptions: {
            output: {
                entryFileNames: `luci-static/tailscaler/[name].js?v=[hash]`,
                chunkFileNames: `luci-static/tailscaler/chunk.[hash].js`,
                assetFileNames: `luci-static/tailscaler/[name].[ext]?v=[hash]`
            },
            plugins: [
                rename()
            ],
            external: []
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                charset: false,
                additionalData: `
                    @import "./src/style/scss/transition.scss";
				`,
            }
        }
    },
    plugins: [
        vue(),
    ]
})
