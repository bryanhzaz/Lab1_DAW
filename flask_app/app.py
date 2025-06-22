from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/formulario', methods=['GET', 'POST'])
def formulario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        return redirect(url_for('saludo', nombre=nombre))
    return render_template('formulario.html')

@app.route('/saludo')
def saludo():
    nombre = request.args.get('nombre', 'Usuario')
    return render_template('saludo.html', nombre=nombre)

if __name__ == '__main__':
    app.run(debug=True)
