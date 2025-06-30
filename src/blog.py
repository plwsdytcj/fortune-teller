import os
import frontmatter
import markdown
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

BLOG_DIR = os.path.join(os.path.dirname(__file__), "../blogs")

class BlogPost(BaseModel):
    id: str
    title: str
    date: str
    content: str

def load_blogs():
    blogs = []
    if not os.path.exists(BLOG_DIR):
        return blogs
    for fname in os.listdir(BLOG_DIR):
        if fname.endswith(".md"):
            path = os.path.join(BLOG_DIR, fname)
            with open(path, "r", encoding="utf-8") as f:
                post = frontmatter.load(f)
                html_content = markdown.markdown(post.content)
                blogs.append(BlogPost(
                    id=os.path.splitext(fname)[0],
                    title=post.get("title", os.path.splitext(fname)[0]),
                    date=post.get("date", "1970-01-01"),
                    content=html_content
                ))
    blogs.sort(key=lambda x: x.date, reverse=True)
    return blogs

@router.get("/blogs", response_model=List[BlogPost])
def list_blogs():
    return load_blogs()

@router.get("/blogs/{id}", response_model=BlogPost)
def get_blog(id: str):
    for blog in load_blogs():
        if blog.id == id:
            return blog
    raise HTTPException(status_code=404, detail="Blog not found") 