# Portfolio - Leki Reddy Sree Priya

A hand-built portfolio (HTML, CSS, JavaScript, no framework) with a **Python (Flask) backend**.

Interactions: flip pad of roles, doors that open on hover and lead into a room for each skill, a 3D skill card that tilts and flips, a pull cord for light/dark mode, a scroll-driven journey timeline, cursor ring, tilting cards and magnetic buttons.

## Python backend features
| Address | What it does |
| --- | --- |
| `POST /api/contact` | Checks the contact form on the server and saves the message |
| `GET / POST /api/visits` | Visitor counter shown in the footer |
| `GET /api/messages?key=ADMIN_KEY` | Lists the saved messages (private) |
| `GET /api/health` | Shows the backend is running and which storage it uses |

Data is stored in MongoDB Atlas when the `MONGODB_URI` variable is set.

## Files
- `js/content.js` - all the text on the site. Edit only this file.
- `assets/photo.jpg` - the photo.
- `index.html`, `css/style.css`, `js/main.js` - the page, design and animations.
- `api/index.py` - the Python backend.
- `requirements.txt`, `vercel.json` - needed by Vercel.

## Run on your computer
```
pip install -r requirements.txt
python api/index.py
```
Open http://127.0.0.1:5000

## Put it online (Vercel)
1. Upload this folder to a GitHub repository.
2. On vercel.com choose Add New > Project and import the repository.
3. Add the environment variables `MONGODB_URI` and `ADMIN_KEY`, then Deploy.
4. Open `your-site.vercel.app/api/health` - it should say `"storage": "mongodb"`.
