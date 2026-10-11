// src/components/projeto-final/contexts/ThemeContext.tsx

import {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
} from 'react';
import type { ReactNode } from 'react';

import {
    ThemeProvider as MuiThemeProvider,
    createTheme,
} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';

// Tipos permitidos para o tema
type Theme = 'light' | 'dark';

// Propriedades disponibilizadas pelo contexto
interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: ReactNode;
}

// Contexto global de tema
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('theme');

        return savedTheme === 'dark' ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((previousTheme) =>
            previousTheme === 'light' ? 'dark' : 'light'
        );
    };

    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: theme,
                },
            }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <MuiThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

// Hook personalizado
export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme deve ser usado dentro de ThemeProvider');
    }

    return context;
};