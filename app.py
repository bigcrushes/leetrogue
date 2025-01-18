from flask import Flask, render_template, request, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.json.get('code', '')
    
    # Create a temporary file to store the code
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(code)
        temp_file_path = f.name
    
    try:
        # Execute the code and capture output
        result = subprocess.run(['python', temp_file_path], 
                              capture_output=True,
                              text=True,
                              timeout=5)
        
        output = result.stdout
        error = result.stderr
        
        return jsonify({
            'output': output,
            'error': error
        })
    except subprocess.TimeoutExpired:
        return jsonify({
            'error': 'Execution timed out (5 seconds limit)'
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        })
    finally:
        # Clean up the temporary file
        os.unlink(temp_file_path)

if __name__ == '__main__':
    app.run(debug=True)