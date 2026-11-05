'use client';
import {useEffect,useRef,useState,Suspense} from 'react';
import './journey.css';
import {Canvas,useFrame} from '@react-three/fiber';
import {useGLTF} from '@react-three/drei';
import {Vector3} from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {sampleTour,stops,chapters,chapterAt,destinations,stopAt,roomActions} from './tour';
function Room({progress}:{progress:number}){const {scene}=useGLTF('/models/showroom.glb');const t=useRef(progress),eye=useRef(new Vector3()),target=useRef(new Vector3());useFrame(({camera,size},dt)=>{t.current+=(progress-t.current)*(1-Math.exp(-8*dt));sampleTour(t.current,size.width<650,eye.current,target.current);camera.position.copy(eye.current);camera.lookAt(target.current)});return <primitive object={scene}/>}
export default function Journey(){const ref=useRef<HTMLElement>(null),[p,set]=useState(0),[visible,show]=useState(false);useEffect(()=>{gsap.registerPlugin(ScrollTrigger);const trigger=ScrollTrigger.create({trigger:ref.current,start:'top top',end:'bottom bottom',onUpdate:s=>set(s.progress)});const io=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)show(true)},{rootMargin:'180px'});io.observe(ref.current!);return()=>{io.disconnect();trigger.kill()}},[]);const chapter=chapters[chapterAt(p)],room=stopAt(p),action=roomActions[room]||[chapter.action,chapter.path];return <section ref={ref} id="showroom" style={{height:'340vh',position:'relative'}}><div style={{height:'100svh',position:'sticky',top:0,background:'#d4ccc0'}}>{visible&&<Canvas dpr={[1,1.4]} fallback={<img src="/art/interior.webp" alt="Showroom interior" style={{width:'100%'}}/>}><ambientLight intensity={1.5}/><directionalLight position={[2,6,4]} intensity={3}/><Suspense fallback={null}><Room progress={p}/></Suspense></Canvas>}<div className="tourcopy"><small>THE LIVE SHOWROOM　 /　0{chapterAt(p)+1}</small><h2>{chapter.heading}</h2><p>{chapter.body}</p><a href={action[1]}>{action[0]} ↗</a></div><select aria-label="Showroom destination" className="roomSelect" value={destinations.some(([k])=>k===room)?room:''} onChange={e=>{const el=ref.current!;window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top+stops[e.target.value].at*(el.offsetHeight-innerHeight),behavior:'smooth'})}}><option value="" disabled>Explore a room</option>{destinations.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div></section>}


