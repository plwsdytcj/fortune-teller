
```

RUN Folloiwng

```bash
cd frontend
pnpm install
pnpm build --emptyOutDir
cd ..
rm -r dist
cp -r frontend/dist/ dist
python3 -m venv ./venv
./venv/bin/python3 -m pip install -r requirements.txt
./venv/bin/python3 main.py
```
