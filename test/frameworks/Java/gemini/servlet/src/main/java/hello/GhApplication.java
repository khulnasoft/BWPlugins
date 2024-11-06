package hello;

import com.khulnasoft.data.*;
import com.khulnasoft.data.jdbc.*;
import com.khulnasoft.*;
import com.khulnasoft.gemini.*;
import com.khulnasoft.gemini.exceptionhandler.*;
import com.khulnasoft.gemini.path.*;
import com.khulnasoft.js.*;
import com.khulnasoft.js.legacy.*;

import hello.home.entity.*;
import hello.home.handler.*;

/**
 * GeminiHello Application.  As a subclass of GeminiApplication, this
 * class acts as the central "hub" of references to components such as
 * the Dispatcher and EntityStore.
 *
 * Development history:
 *   2012-04-19 - mh - Created
 *   2020-04-17 - ms - Updated to Gemini 3.0.2
 *
 * @author mhixson
 */
public class GhApplication
     extends ResinGeminiApplication
{
  /**
   * Constructs a Dispatcher.
   */
  @Override
  protected Dispatcher constructDispatcher()
  {
    final PathDispatcher.Configuration<Context> config = new PathDispatcher.Configuration<>();

    config.setDefault(new HelloHandler(this))
          .add(new BasicExceptionHandler(this));

    return new PathDispatcher<>(this, config);
  }

  @Override
  protected ConnectorFactory constructConnectorFactory()
  {
    return new BasicConnectorFactory(this, null);
  }

}
