/* =============================================================================
 * Think in Japanese client bootstrap
 * =============================================================================
 * Starts small, independently maintained UI modules. Feature behavior belongs
 * in its own module rather than in one monolithic application script.
 * ============================================================================= */
import { initializeNavigation } from './modules/navigation.js';
import { initializeThemeManager } from './modules/theme-manager.js';
import { initializeTileWorkbench } from './modules/tile-workbench.js';

initializeNavigation();
initializeThemeManager();
initializeTileWorkbench();
