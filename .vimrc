" The width of a hard tabstop measured in "spaces" -- effectively the (maximum) width of an actual tab character.
set tabstop=2
set shiftwidth=2
" Enabling this will make the tab key (in insert mode) insert spaces or tabs to go to the next indent of the next tabstop when the cursor is at the beginning of a line (i.e. the only preceding characters are whitespace).
set smarttab
" Enabling this will make the tab key (in insert mode) insert spaces instead of tab characters. This also affects the behavior of the retab command.
set expandtab
" Setting this to a non-zero value other than tabstop will make the tab key (in insert mode) insert a combination of spaces (and possibly tabs) to simulate tab stops at this width.
set softtabstop=2
set autoindent

" Vim Configuration for ALE and Prettier/ESLint
let g:ale_lint_on_enter = 0
let g:ale_linters = {
    \   'javascript': ['eslint'],
    \}

:noremap <S-m> :ALEToggle <CR>
