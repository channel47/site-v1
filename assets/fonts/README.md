# Social preview fonts

`InstrumentSerif-Regular.ttf` and `InstrumentSans-Regular.ttf` come from the
same Latin WOFF2 files in `app/fonts/`. Instrument Sans is instantiated at
weight 400. They are used by `next/og`, whose font parser requires TTF, OTF or
WOFF rather than WOFF2. The OFL licenses remain in `app/fonts/`.

To regenerate after updating the source fonts:

```sh
uv run --with fonttools --with brotli python - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
for family in ['serif', 'sans']:
    font = TTFont(f'app/fonts/instrument-{family}-latin.woff2')
    if 'fvar' in font:
        font = instantiateVariableFont(font, {'wght': 400}, inplace=True)
    font.flavor = None
    font.save(f'assets/fonts/Instrument{family.title()}-Regular.ttf')
PY
```

The older Geist files are retained for existing workflows; the current
renderer no longer uses them.
