/**
 * Module Federation requires an async boundary before any shared module is
 * touched, so the real bootstrap is loaded dynamically. Keep this file tiny.
 */
import('./bootstrap');

export {};
