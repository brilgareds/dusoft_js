({
 
   // baseUrl: '../../',
    name: "app",
    out: "dist/main.js",
    removeCombined: true,
	findNestedDependencies: true,
    mainConfigFile : "main-dev.js",
    insertRequire: ['app']
    //optimize:'none',
})
 
 
 
 <?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
   
 >

     <RelativeLayout 
		android:layout_height="wrap_content"
		android:layout_width="fill_parent"
		android:id="@+id/back"    
		android:background="@drawable/preview_bg_eliminar"
		android:layout_centerVertical="true"
	>
		<TextView 
		 	android:layout_width="wrap_content"
		 	android:layout_height="wrap_content"
		 	android:text="@string/confirmarborrarproducto"   
		 	android:layout_toLeftOf="@+id/btneliminarlote"
		 	android:layout_marginRight="20dp"
		 	android:layout_centerVertical="true"
		 	android:textColor="@android:color/white"
		 	android:id="@+id/lblconfirmarborrarlote"
		 
		 />

	      
	      <Button 
	       	android:layout_height="wrap_content"
	       	android:layout_width="wrap_content"
	       	android:id="@+id/btneliminarlote"
	       	android:tag="btneliminarlote"
	       	android:layout_alignParentRight="true"
	       	android:background="@drawable/preview_boton_eliminar_btn_skin"
	       />
	    
	</RelativeLayout>
    
     <RelativeLayout 
		android:layout_height="84dp"
		android:layout_width="fill_parent"
		android:background="@android:color/white"
		android:paddingLeft="40dp"
	    android:paddingBottom="15dp"
	    android:paddingTop="15dp"
		android:id="@+id/front">
    
		    <LinearLayout
		   		android:layout_width="match_parent"
		   		android:layout_height="wrap_content"
		   		android:orientation="horizontal"
		   		android:id="@+id/firstrow"
		    >
		        <!-- TextView 
			    	android:layout_width="0dp"
			    	android:layout_weight="20"
			    	android:layout_height="wrap_content"
					android:id="@+id/txtpreviewcodigoproducto"
			    /-->
		        
		        <!-- TextView 
		        	android:layout_width="350dp"
		        	android:layout_height="wrap_content"
		        	android:layout_marginRight="70dp"
		        	android:text="Observacion"    
		        
		        /-->
		        
		        <TextView 
			    	android:layout_width="0dp"
			    	android:layout_weight="20"
			    	style="@style/defaultfont"
			    	android:layout_height="wrap_content"
					android:id="@+id/txtpreviewlote"    	   
			    /> 
		        
			     
		        <TextView 
		        	android:layout_width="0dp"
			    	android:layout_weight="20"
		        	android:layout_height="wrap_content"
		        	android:id="@+id/txtpreviewcantidadsolicitada"    
		        
		        />
		        
		         <TextView 
			    	android:layout_width="0dp"
			    	android:layout_weight="20"
			    	android:layout_height="wrap_content"
					android:id="@+id/txtpreviewcantidadlote"    
			    /> 
			    
		           <TextView 
		        	android:layout_width="0dp"
			    	android:layout_weight="20"
		        	android:layout_height="wrap_content"
		        	android:id="@+id/txtpreviewcantidadpendiente"    
		        
		        />
 
			    
		          <TextView 
			    	android:layout_width="0dp"
			    	android:layout_weight="25"
			    	android:layout_height="wrap_content"
					android:id="@+id/txtpreviewfechavc"
			    />
			       
			    
		    </LinearLayout>
		     
		     <RelativeLayout
		   		android:layout_width="match_parent"
		   		android:layout_height="wrap_content"
		   		android:orientation="horizontal"
		   		android:layout_below="@id/firstrow"
		   		android:id="@+id/secondrow" 
		   		android:layout_marginTop="10dp"
		    >
			    
		          <TextView 
			         
			    	android:layout_width="553dp"
			    	android:layout_height="wrap_content"
					android:id="@+id/txtpreviewnombreproducto"
					android:singleLine="true"
					android:layout_marginRight="5dp"    	    
			    />
		         

		           
                <TextView 
			    	android:layout_width="300dp"
			    	android:layout_toRightOf="@id/txtpreviewnombreproducto"
			    	android:layout_height="wrap_content"
					android:id="@+id/txtjustificacion"    	  
					 
			    />
              
			    			     
		    </RelativeLayout>
		    
		     
		  <ImageView 
		     	android:layout_width="wrap_content"
		     	android:layout_height="wrap_content"
		     	android:background="@drawable/preview_boton_slide"
		     	android:id="@+id/indicador1"
		     	android:layout_alignParentRight="true"   
		     />
		         

    </RelativeLayout>
    

    

</RelativeLayout>
