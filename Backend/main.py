from fastapi import FastAPI

# Instância do app FastAPI
app = FastAPI()

# Rota de teste
@app.get("/")
def read_root():
    return {"message": "API do BI está no ar!"}

# Rota de exemplo com parâmetro
@app.get("/hello/{name}")
def say_hello(name: str):
    return {"message": f"Olá, {name}!"}

