import { PieceUtils } from "../game/utils/PieceUtils";
import { Texture } from "pixi.js";

export class AtlasKeys {
    public static ATLAS_XML = "./assets/matchthree-pixijs-atlas.json";
    public static ATLAS_PNG = "./assets/matchthree-pixijs-atlas.png";

    public static FONT_FNT = "./assets/fonts/BerlinSansDemi.fnt";

    /* ATLAS PREFIX */
    public static LOGO_SETZER = "logo_setzer.png";
    public static LOGO_TYPESCRIPT = "./assets/logo_typescript.png";

    public static PIECE_NORMAL = "piece_normal";
    public static PIECE_ROW = "piece_row";
    public static PIECE_COL = "piece_col";
    public static PIECE_RAINBOW = "piece_rainbow";

    /* BUTTONS */
    public static BUTTON_SMALL = "button_small";
    public static BUTTON_SMALL_DANGER = "button_small_danger";
    public static BUTTON_MEDIUM = "button_medium";

    /* ICONS */
    public static ICON_LEVEL_SELECT = "icon_level_select.png";
    public static ICON_PAUSE = "icon_pause.png";
    public static ICON_RESUME = "icon_resume.png";
    public static ICON_DELETE = "icon_delete.png";
    public static ICON_RETRY = "icon_retry.png";
    public static ICON_CONFIG = "icon_config.png";
    public static ICON_HOME = "icon_home.png";

    public static ICON_CONFIRM = "icon_confirm.png";
    public static ICON_CLOSE = "icon_close.png";

    /* Others */
    public static POPUP_STAR = "popup_star";
    public static STAR_HUD_DISPLAY = "star_hud_display_";
    public static LEVEL_SELECT_SMALL_STAR = "level_select_small_star";
    public static LOGO_MATCH_THREE = "logo_matchthree.png";

    public static BG_IMAGE = "./assets/backgrounds/background.png";
    public static BG_POPUP_IMAGE = "./assets/backgrounds/background_popup.png";
    public static BG_HUD_IMAGE = "./assets/backgrounds/background_hud.png";

    private static resources: any;
    private static textureCache: any;

    public static update(textureCache: any): void {
        this.textureCache = textureCache;
    }
    public static getTexture(atlasKey): Texture {
        return this.textureCache[atlasKey];
    }
}
